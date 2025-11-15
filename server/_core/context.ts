import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getUserFromToken, syncUserToDatabase } from "./supabase";

export type User = {
  id: number;
  auth_id: string;
  email: string | null;
  name: string | null;
  role: string;
  profile_image: string | null;
  phone: string | null;
  address: string | null;
  wallet_balance: number;
  seller_rating: number | null;
  total_sales: number;
  is_seller: boolean;
  last_signed_in: string;
  created_at: string;
  updated_at: string;
};

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Get token from Authorization header
    const authHeader = opts.req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Get user from Supabase Auth
      const authUser = await getUserFromToken(token);
      if (authUser) {
        // Sync to our users table and get full user data
        user = await syncUserToDatabase(authUser) as User;
      }
    }
  } catch (error) {
    console.error('[Context] Authentication error:', error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
