import { useState, useRef, DragEvent } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ImageUploaderProps {
  onUpload: (url: string, key: string) => void;
  onDelete?: (key: string) => void;
  prefix: "profiles" | "products" | "id-cards" | "chat";
  currentImage?: string;
  multiple?: boolean;
  maxImages?: number;
  resize?: { width: number; height: number };
}

export function ImageUploader({
  onUpload,
  onDelete,
  prefix,
  currentImage,
  multiple = false,
  maxImages = 10,
  resize,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.image.upload.useMutation();
  const uploadMultipleMutation = trpc.image.uploadMultiple.useMutation();

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    // Validate file count
    if (multiple && files.length > maxImages) {
      toast.error(`สามารถอัพโหลดได้สูงสุด ${maxImages} รูป`);
      return;
    }

    if (!multiple && files.length > 1) {
      toast.error("สามารถอัพโหลดได้ 1 รูปเท่านั้น");
      return;
    }

    // Validate file types
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      toast.error("รองรับเฉพาะไฟล์ JPG, PNG, WebP, GIF เท่านั้น");
      return;
    }

    // Validate file sizes (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast.error("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      if (multiple) {
        // Upload multiple images
        const base64Images = await Promise.all(
          files.map((file) => fileToBase64(file))
        );

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        const result = await uploadMultipleMutation.mutateAsync({
          images: base64Images,
          prefix,
          resize,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Call onUpload for each image
        result.forEach((img) => {
          onUpload(img.url, img.key);
        });

        toast.success(`อัพโหลดสำเร็จ ${result.length} รูป`);
      } else {
        // Upload single image
        const base64 = await fileToBase64(files[0]);

        // Show preview
        setPreview(base64);

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        const result = await uploadMutation.mutateAsync({
          image: base64,
          prefix,
          resize,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        setPreview(result.url);
        onUpload(result.url, result.key);

        toast.success("อัพโหลดสำเร็จ");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการอัพโหลด");
      setPreview(null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4">
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div className="w-full max-w-xs">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    กำลังอัพโหลด... {uploadProgress}%
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold mb-1">
                    ลากไฟล์มาวางที่นี่ หรือ
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    เลือกไฟล์
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  รองรับ JPG, PNG, WebP, GIF (สูงสุด 5MB)
                  {multiple && ` | สูงสุด ${maxImages} รูป`}
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Multiple Images Uploader Component
 */
interface MultipleImagesUploaderProps {
  onUpload: (images: Array<{ url: string; key: string }>) => void;
  prefix: "profiles" | "products" | "id-cards" | "chat";
  maxImages?: number;
  currentImages?: Array<{ url: string; key: string }>;
}

export function MultipleImagesUploader({
  onUpload,
  prefix,
  maxImages = 10,
  currentImages = [],
}: MultipleImagesUploaderProps) {
  const [images, setImages] = useState<Array<{ url: string; key: string }>>(
    currentImages
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMultipleMutation = trpc.image.uploadMultiple.useMutation();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    // Check max images
    if (images.length + files.length > maxImages) {
      toast.error(`สามารถอัพโหลดได้สูงสุด ${maxImages} รูป`);
      return;
    }

    setUploading(true);

    try {
      const base64Images = await Promise.all(
        files.map((file) => fileToBase64(file))
      );

      const result = await uploadMultipleMutation.mutateAsync({
        images: base64Images,
        prefix,
      });

      const newImages = [...images, ...result];
      setImages(newImages);
      onUpload(newImages);

      toast.success(`อัพโหลดสำเร็จ ${result.length} รูป`);
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาดในการอัพโหลด");
    } finally {
      setUploading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUpload(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image.url}
              alt={`Image ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemove(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {images.length < maxImages && (
          <div
            className="border-2 border-dashed border-border rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            {uploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <div className="text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  เพิ่มรูปภาพ
                  <br />({images.length}/{maxImages})
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
