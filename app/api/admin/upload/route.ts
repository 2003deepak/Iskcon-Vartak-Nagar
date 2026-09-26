import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { storeEventImage } from "@/lib/storage";
import { connectToDatabase } from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const adminContext = await getAuthenticatedAdmin(request);
    if (!adminContext) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "Events";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was uploaded." },
        { status: 400 }
      );
    }

    // Convert File into Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const storedResult = await storeEventImage(buffer, file.name, folder);

    // Record in Audit Log
    try {
      await connectToDatabase();
      await AuditLog.create({
        action: "UPLOAD_IMAGE",
        entityType: "Media",
        entityTitle: storedResult.filename,
        performedBy: {
          id: adminContext.user._id?.toString(),
          name: adminContext.user.name,
          email: adminContext.user.email,
          role: adminContext.user.role,
        },
        details: {
          filename: storedResult.filename,
          size: storedResult.size,
          mimeType: storedResult.mimeType,
          provider: storedResult.provider,
          url: storedResult.url,
        },
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      });
    } catch (auditErr) {
      console.warn("[Audit Log] Failed to record image upload:", auditErr);
    }

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully.",
      image: storedResult,
    });
  } catch (error: any) {
    console.error("[Admin Upload Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload image." },
      { status: 500 }
    );
  }
}
