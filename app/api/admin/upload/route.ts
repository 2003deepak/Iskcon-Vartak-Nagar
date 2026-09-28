import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { storeEventImage } from "@/lib/storage";

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
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "Media";

    const allFiles: File[] = files.length > 0 ? files : singleFile ? [singleFile] : [];

    if (allFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files were uploaded." },
        { status: 400 }
      );
    }

    if (allFiles.length > 10) {
      return NextResponse.json(
        { success: false, error: "You can upload a maximum of 10 photos at once." },
        { status: 400 }
      );
    }

    // Process all files in parallel
    const storedResults = await Promise.all(
      allFiles.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return await storeEventImage(buffer, file.name, folder);
      })
    );

    return NextResponse.json({
      success: true,
      message: `${storedResults.length} image(s) uploaded successfully.`,
      image: storedResults[0],
      images: storedResults,
    });
  } catch (error: any) {
    console.error("[Admin Upload Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload image(s)." },
      { status: 500 }
    );
  }
}
