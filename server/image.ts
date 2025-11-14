import { storagePut } from "./storage";
import sharp from "sharp";

/**
 * Image Upload Configuration
 */
const IMAGE_CONFIG = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  maxDimensions: {
    width: 4096,
    height: 4096,
  },
  thumbnailSize: {
    width: 300,
    height: 300,
  },
};

/**
 * Generate random file key to prevent enumeration
 */
function generateFileKey(userId: number, prefix: string, ext: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}/${userId}-${timestamp}-${random}.${ext}`;
}

/**
 * Validate image file
 */
export function validateImage(base64: string, mimeType: string): { valid: boolean; error?: string } {
  // Check mime type
  if (!IMAGE_CONFIG.allowedMimeTypes.includes(mimeType)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${IMAGE_CONFIG.allowedMimeTypes.join(", ")}`,
    };
  }

  // Check file size (base64 to bytes)
  const base64Data = base64.split(",")[1] || base64;
  const sizeBytes = (base64Data.length * 3) / 4;

  if (sizeBytes > IMAGE_CONFIG.maxSizeBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${IMAGE_CONFIG.maxSizeBytes / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

/**
 * Upload image to S3
 * @param base64 - Base64 encoded image data
 * @param userId - User ID for file organization
 * @param prefix - Folder prefix (e.g., 'profiles', 'products', 'id-cards')
 * @param options - Upload options
 */
export async function uploadImage(
  base64: string,
  userId: number,
  prefix: string,
  options?: {
    resize?: { width: number; height: number };
    quality?: number;
  }
): Promise<{ url: string; key: string }> {
  try {
    // Extract mime type and data
    const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 image format");
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    // Validate image
    const validation = validateImage(base64, mimeType);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Process image with sharp
    let imageBuffer = buffer;
    let processedImage = sharp(buffer);

    // Get image metadata
    const metadata = await processedImage.metadata();

    // Validate dimensions
    if (
      metadata.width &&
      metadata.height &&
      (metadata.width > IMAGE_CONFIG.maxDimensions.width ||
        metadata.height > IMAGE_CONFIG.maxDimensions.height)
    ) {
      throw new Error(
        `Image dimensions too large. Maximum: ${IMAGE_CONFIG.maxDimensions.width}x${IMAGE_CONFIG.maxDimensions.height}`
      );
    }

    // Resize if needed
    if (options?.resize) {
      processedImage = processedImage.resize(options.resize.width, options.resize.height, {
        fit: "cover",
        position: "center",
      });
    }

    // Optimize image
    const ext = mimeType.split("/")[1];
    if (ext === "jpeg" || ext === "jpg") {
      processedImage = processedImage.jpeg({ quality: options?.quality || 85 });
    } else if (ext === "png") {
      processedImage = processedImage.png({ quality: options?.quality || 85 });
    } else if (ext === "webp") {
      processedImage = processedImage.webp({ quality: options?.quality || 85 });
    }

    imageBuffer = Buffer.from(await processedImage.toBuffer());

    // Generate unique file key
    const fileKey = generateFileKey(userId, prefix, ext);

    // Upload to S3
    const result = await storagePut(fileKey, imageBuffer, mimeType);

    return {
      url: result.url,
      key: fileKey,
    };
  } catch (error) {
    console.error("[Image Upload Error]", error);
    throw error;
  }
}

/**
 * Upload multiple images
 */
export async function uploadMultipleImages(
  images: string[],
  userId: number,
  prefix: string,
  options?: {
    resize?: { width: number; height: number };
    quality?: number;
  }
): Promise<Array<{ url: string; key: string }>> {
  const uploadPromises = images.map((image) => uploadImage(image, userId, prefix, options));
  return Promise.all(uploadPromises);
}

/**
 * Delete image from S3
 * Note: S3 deletion is not implemented in storage.ts yet
 * This is a placeholder for future implementation
 */
export async function deleteImage(key: string): Promise<void> {
  // TODO: Implement S3 deletion
  // For now, we'll just log it
  console.log(`[Image Delete] Would delete: ${key}`);
  // In production, you would call AWS S3 deleteObject API
}

/**
 * Create thumbnail
 */
export async function createThumbnail(
  base64: string,
  userId: number,
  prefix: string
): Promise<{ url: string; key: string }> {
  return uploadImage(base64, userId, `${prefix}/thumbnails`, {
    resize: IMAGE_CONFIG.thumbnailSize,
    quality: 80,
  });
}
