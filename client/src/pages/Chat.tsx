import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Send, MessageCircle, User } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

type Message = {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
  sender: {
    name: string;
    profile_image: string | null;
  };
};

type Conversation = {
  id: number;
  user_id: number;
  other_user_id: number;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  other_user: {
    name: string;
    profile_image: string | null;
  };
};

export default function Chat() {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch conversations
  useEffect(() => {
    async function fetchConversations() {
      if (!user) return;
      setIsLoading(true);

      // Get all messages where user is sender or receiver
      const { data: messagesData } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!sender_id (name, profile_image),
          receiver:users!receiver_id (name, profile_image)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (!messagesData) {
        setIsLoading(false);
        return;
      }

      // Group messages by conversation
      const conversationMap = new Map<number, Conversation>();

      messagesData.forEach((msg: any) => {
        const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        const otherUser = msg.sender_id === user.id ? msg.receiver : msg.sender;

        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            id: otherUserId,
            user_id: user.id,
            other_user_id: otherUserId,
            last_message: msg.message,
            last_message_at: msg.created_at,
            unread_count: 0,
            other_user: otherUser,
          });
        }
      });

      setConversations(Array.from(conversationMap.values()));
      setIsLoading(false);
    }

    fetchConversations();

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user?.id}`,
        },
        (payload) => {
          // Refresh conversations when new message arrives
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Fetch messages for selected conversation
  useEffect(() => {
    async function fetchMessages() {
      if (!user || !selectedConversation) return;
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!sender_id (name, profile_image)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedConversation}),and(sender_id.eq.${selectedConversation},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      setMessages(data || []);
    }

    fetchMessages();

    // Subscribe to new messages in this conversation
    const channel = supabase
      .channel(`messages-${selectedConversation}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload: any) => {
          const newMsg = payload.new;
          if (
            (newMsg.sender_id === user?.id && newMsg.receiver_id === selectedConversation) ||
            (newMsg.sender_id === selectedConversation && newMsg.receiver_id === user?.id)
          ) {
            fetchMessages();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !selectedConversation || !newMessage.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: selectedConversation,
        message: newMessage.trim(),
      });

    if (error) {
      console.error('Error sending message:', error);
      toast.error('ไม่สามารถส่งข้อความได้');
      return;
    }

    setNewMessage("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h2>
            <Button
              size="lg"
              className="btn-glow gradient-red-orange"
              onClick={() => setLocation("/login")}
            >
              เข้าสู่ระบบ
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">ข้อความ</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="p-4 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">การสนทนา</h2>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">ยังไม่มีการสนทนา</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.other_user_id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conv.other_user_id
                        ? 'bg-primary/20 border border-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {conv.other_user.profile_image ? (
                          <img
                            src={conv.other_user.profile_image}
                            alt={conv.other_user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{conv.other_user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.last_message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Messages */}
          <Card className="md:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Messages List */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">ยังไม่มีข้อความ</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => {
                        const isOwn = msg.sender_id === user?.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isOwn
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              {!isOwn && (
                                <p className="text-xs font-semibold mb-1">
                                  {msg.sender.name}
                                </p>
                              )}
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(msg.created_at).toLocaleTimeString('th-TH', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="พิมพ์ข้อความ..."
                      className="flex-1"
                    />
                    <Button type="submit" className="btn-glow gradient-red-orange">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">เลือกการสนทนาเพื่อเริ่มแชท</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
