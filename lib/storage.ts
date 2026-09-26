import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface StoredImageResult {
  url: string;
  fileId?: string;
  filename: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  uploadedAt: Date;
  provider: "imagekit" | "local";
}

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  mimeType?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Validates binary magic bytes to ensure file is an authentic image
 * Prevents disguised executable or malicious scripts from bypassing extension checks.
 */
export function validateImageBuffer(buffer: Buffer): ImageValidationResult {
  if (!buffer || buffer.length === 0) {
    return { isValid: false, error: "Empty file provided." };
  }

  if (buffer.length > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    };
  }

  // Check Magic Bytes
  // JPEG: FF D8 FF
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, mimeType: "image/jpeg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { isValid: true, mimeType: "image/png" };
  }

  // WebP: RIFF ... WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { isValid: true, mimeType: "image/webp" };
  }

  // GIF: GIF87a or GIF89a
  if (
    buffer.length >= 6 &&
    (buffer.toString("ascii", 0, 6) === "GIF87a" || buffer.toString("ascii", 0, 6) === "GIF89a")
  ) {
    return { isValid: true, mimeType: "image/gif" };
  }

  // AVIF: ....ftypavif
  if (buffer.length >= 12 && buffer.toString("ascii", 4, 12).includes("avif")) {
    return { isValid: true, mimeType: "image/avif" };
  }

  return {
    isValid: false,
    error: "Invalid file format. Only authentic JPG, PNG, WebP, GIF, and AVIF images are permitted.",
  };
}

/**
 * Basic image dimension parser from buffer
 */
export function extractBasicDimensions(
  buffer: Buffer,
  mimeType: string
): { width?: number; height?: number } {
  try {
    if (mimeType === "image/png" && buffer.length >= 24) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }

    if (mimeType === "image/jpeg") {
      let offset = 2;
      while (offset < buffer.length - 8) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];
        if (
          (marker >= 0xc0 && marker <= 0xc3) ||
          (marker >= 0xc5 && marker <= 0xc7) ||
          (marker >= 0xc9 && marker <= 0xcb) ||
          (marker >= 0xcd && marker <= 0xcf)
        ) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }
        const length = buffer.readUInt16BE(offset + 2);
        offset += 2 + length;
      }
    }
  } catch {
    // Dimension extraction failure is non-fatal
  }
  return {};
}

/**
 * Stores an image using ImageKit (if configured) or local storage fallback.
 */
export async function storeEventImage(
  buffer: Buffer,
  originalFilename: string,
  folder: string = "Events"
): Promise<StoredImageResult> {
  const validation = validateImageBuffer(buffer);
  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid image file");
  }

  const mimeType = validation.mimeType || "image/jpeg";
  const ext = mimeType === "image/png" ? ".png" : mimeType === "image/webp" ? ".webp" : mimeType === "image/gif" ? ".gif" : ".jpg";
  const sanitizedBase = originalFilename
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 40);
  const randomSuffix = crypto.randomBytes(6).toString("hex");
  const uniqueFilename = `${sanitizedBase}_${randomSuffix}${ext}`;
  const dimensions = extractBasicDimensions(buffer, mimeType);

  // Check if ImageKit IO credentials exist
  const imageKitPrivateKey = (process.env.IMAGEKIT_PRIVATE_KEY || "").trim();
  const imageKitEndpoint = (process.env.IMAGEKIT_URL_ENDPOINT || "").trim();

  if (imageKitPrivateKey) {
    try {
      const formData = new FormData();
      formData.append("file", buffer.toString("base64"));
      formData.append("fileName", uniqueFilename);
      formData.append("folder", `/${folder}`);
      formData.append("useUniqueFileName", "true");

      const authHeader = `Basic ${Buffer.from(imageKitPrivateKey + ":").toString("base64")}`;

      const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
        body: formData,
      });

      if (res.ok) {
        const ikData = await res.json();
        return {
          url: ikData.url,
          fileId: ikData.fileId,
          filename: ikData.name || uniqueFilename,
          size: ikData.size || buffer.length,
          mimeType,
          width: ikData.width || dimensions.width,
          height: ikData.height || dimensions.height,
          uploadedAt: new Date(),
          provider: "imagekit",
        };
      } else {
        const errorText = await res.text();
        console.error("[Storage] ImageKit API responded with error:", errorText);
        throw new Error(`ImageKit API error (${res.status}): ${errorText}`);
      }
    } catch (ikErr: any) {
      console.error("[Storage] ImageKit upload failed:", ikErr);
      throw new Error(ikErr?.message || "Failed to upload image to ImageKit.");
    }
  }

  // Local Storage Fallback: Save in /public/uploads/events
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "events");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, uniqueFilename);
  fs.writeFileSync(filePath, buffer);

  const localUrl = `/uploads/events/${uniqueFilename}`;

  return {
    url: localUrl,
    filename: uniqueFilename,
    size: buffer.length,
    mimeType,
    width: dimensions.width,
    height: dimensions.height,
    uploadedAt: new Date(),
    provider: "local",
  };
}
