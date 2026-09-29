import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import VolunteerApplication from "@/models/VolunteerApplication";
import {
  sendVolunteerConfirmationEmail,
  sendVolunteerAdminNotificationEmail,
} from "@/lib/email";

// Helper to generate formatted Application Number like VOL-2026-00124
function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return `VOL-${year}-${randomSuffix}`;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const {
      fullName,
      phone,
      email,
      sevaInterest,
      preferredContactMethod = "WhatsApp",
      availability = "Flexible / Weekends",
    } = body;

    // Basic Validation
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || phone.trim().length < 7) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid phone or WhatsApp number." },
        { status: 400 }
      );
    }

    if (!sevaInterest || typeof sevaInterest !== "string") {
      return NextResponse.json(
        { success: false, error: "Please select your preferred seva department." },
        { status: 400 }
      );
    }

    // Generate unique application number with retry for safety
    let applicationNumber = generateApplicationNumber();
    let existing = await VolunteerApplication.findOne({ applicationNumber });
    let attempts = 0;
    while (existing && attempts < 5) {
      applicationNumber = generateApplicationNumber();
      existing = await VolunteerApplication.findOne({ applicationNumber });
      attempts++;
    }

    // Create MongoDB Document
    const newVolunteer = await VolunteerApplication.create({
      applicationNumber,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email && typeof email === "string" ? email.trim() : undefined,
      sevaInterest: sevaInterest.trim(),
      preferredContactMethod: preferredContactMethod || "WhatsApp",
      availability: availability ? availability.trim() : "Flexible / Weekends",
      submittedAt: new Date(),
    });

    // Asynchronously dispatch emails without blocking response
    (async () => {
      try {
        if (newVolunteer.email) {
          await sendVolunteerConfirmationEmail({
            toEmail: newVolunteer.email,
            fullName: newVolunteer.fullName,
            phone: newVolunteer.phone,
            sevaInterest: newVolunteer.sevaInterest,
            applicationNumber: newVolunteer.applicationNumber,
          });
        }

        await sendVolunteerAdminNotificationEmail({
          fullName: newVolunteer.fullName,
          phone: newVolunteer.phone,
          email: newVolunteer.email,
          sevaInterest: newVolunteer.sevaInterest,
          applicationNumber: newVolunteer.applicationNumber,
          preferredContactMethod: newVolunteer.preferredContactMethod,
        });
      } catch (err) {
        console.warn("[Volunteer Notification Email Warning]:", err);
      }
    })();

    return NextResponse.json(
      {
        success: true,
        message: "Volunteer application submitted successfully.",
        application: {
          id: newVolunteer._id,
          applicationNumber: newVolunteer.applicationNumber,
          fullName: newVolunteer.fullName,
          phone: newVolunteer.phone,
          email: newVolunteer.email,
          sevaInterest: newVolunteer.sevaInterest,
          submittedAt: newVolunteer.submittedAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[POST /api/volunteers Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit volunteer application. Please try again.",
      },
      { status: 500 }
    );
  }
}
