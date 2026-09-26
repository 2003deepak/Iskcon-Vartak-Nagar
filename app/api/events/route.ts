import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProgramEvent from "@/models/ProgramEvent";

export const dynamic = "force-dynamic";

const defaultEvents = [
  {
    _id: "evt-janmashtami",
    title: "Sri Krishna Janmashtami Mahotsav 2026",
    slug: "sri-krishna-janmashtami-mahotsav-2026",
    subtitle: "The Most Auspicious Appearance Day of Lord Sri Krishna",
    category: "Grand Festival",
    date: "September 04, 2026",
    time: "4:30 AM – 1:00 AM (Midnight)",
    location: "Main Temple Courtyard & Altar, ISKCON Vartak Nagar, Thane",
    bannerUrl: "https://ik.imagekit.io/9uy2us6yw/LandingPage/download?updatedAt=1752604090619",
    description:
      "Join us for the most grand and ecstatic festival of the year! Experience celestial darshan of Sri Sri Radha Krishna adorned in special flower outfits (Phool Bangla), continuous 24-hour non-stop Harinam Sankirtan, glorious Maha-Abhishekham with sacred teerthas, cultural dramas, 108 Bhoga offerings, and sumptuous midnight Prasadam feast for thousands of devotees.",
    highlights: [
      "Maha-Abhishekham with 108 Kalashas",
      "56 & 108 Bhoga Offering to the Lord",
      "Continuous Non-Stop Ecstatic Kirtan",
      "Grand Midnight Aarti & Mega Prasadam Feast",
    ],
    schedule: [
      { time: "04:30 AM", title: "Mangala Aarti & Tulsi Puja" },
      { time: "08:00 AM", title: "Special Sringar Darshan & Discourse" },
      { time: "10:00 AM - 10:00 PM", title: "Continuous 12-Hour Akhanda Harinama Kirtan" },
      { time: "09:30 PM", title: "Grand Maha-Abhishekham" },
      { time: "12:00 Midnight", title: "Maha Sandhya Aarti & Midnight Feast" },
    ],
    isFeatured: true,
    contactNumber: "+91 93228 81265",
    rsvpLink: "/support-us#donate",
    status: "published",
    order: 1,
  },
  {
    _id: "evt-radhashtami",
    title: "Sri Radhashtami Celebrations",
    slug: "sri-radhashtami-celebrations",
    subtitle: "Divine Appearance Day of Srimati Radharani",
    category: "Grand Festival",
    date: "September 17, 2026",
    time: "5:00 PM – 9:30 PM",
    location: "Main Temple Hall, ISKCON Vartak Nagar, Thane",
    bannerUrl: "/gaur_nitai.jpeg",
    description:
      "Celebrate the supreme unconditional devotion of Srimati Radharani, the internal pleasure potency of Lord Krishna. On this sacred day, devotees are blessed with the rare auspicious Lotus Feet Darshan of Srimati Radharani, soul-stirring kirtans, lecture on Radha Tattva, and Maha Prasadam.",
    highlights: [
      "Rare Lotus Feet Darshan of Sri Radha",
      "Elaborate Panchamrita Abhishekham",
      "Devotional Radha Bhajans & Chanting",
      "Grand Annakut Prasadam Offering",
    ],
    schedule: [
      { time: "05:00 PM", title: "Devotional Kirtan & Welcome" },
      { time: "06:00 PM", title: "Radha Tattva Discourse" },
      { time: "07:00 PM", title: "Maha Abhishekham of Sri Radha" },
      { time: "08:30 PM", title: "Maha Aarti & Royal Feast" },
    ],
    isFeatured: false,
    contactNumber: "+91 93228 81265",
    rsvpLink: "/support-us#donate",
    status: "published",
    order: 2,
  },
  {
    _id: "evt-sunday-feast",
    title: "Sunday Love Feast & Spiritual Satsang",
    slug: "sunday-love-feast-spiritual-satsang",
    subtitle: "Weekly Uplifting Spiritual Gathering for Families & Youth",
    category: "Weekly Program",
    date: "Every Sunday",
    time: "5:30 PM – 8:30 PM",
    location: "Main Temple Hall & Prasadam Hall, ISKCON Vartak Nagar, Thane",
    bannerUrl: "/srila_prabhupada.jpeg",
    description:
      "A weekly sanctuary for your soul! Immerse yourself in melodious congregational kirtan chanting, practical and profound Bhagavad Gita discourses by senior monks, spiritual fellowship, kids value education activities, and a multi-course vegetarian sanctified Love Feast (Prasadam).",
    highlights: [
      "Enlivening Gaura Aarti & Kirtan Mela",
      "Practical Bhagavad Gita Discourse",
      "Special Youth & Children Q&A",
      "Free Multi-Course Delicious Prasadam",
    ],
    schedule: [
      { time: "05:30 PM", title: "Tulsi Aarti & Melodious Kirtan" },
      { time: "06:15 PM", title: "Vedic Wisdom Discourse & Q&A" },
      { time: "07:30 PM", title: "Grand Sandhya Gaura Aarti" },
      { time: "08:00 PM", title: "Sumptuous Sunday Love Feast" },
    ],
    isFeatured: false,
    contactNumber: "+91 93228 81265",
    rsvpLink: "/support-us#donate",
    status: "published",
    order: 3,
  },
];

/**
 * GET /api/events
 * Public Read-Only Endpoint for Published Program Events
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limitParam = searchParams.get("limit");

    const now = new Date();

    // Query strictly for published content (exclude drafts and archived)
    const query: Record<string, any> = {
      status: { $in: ["published", "upcoming"] },
      $or: [
        { publishAt: { $exists: false } },
        { publishAt: null },
        { publishAt: { $lte: now } },
      ],
    };

    if (category && category !== "All Events" && category !== "all") {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    if (search && search.trim().length > 0) {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$and = [
        {
          $or: [
            { title: new RegExp(sanitized, "i") },
            { subtitle: new RegExp(sanitized, "i") },
            { description: new RegExp(sanitized, "i") },
            { location: new RegExp(sanitized, "i") },
          ],
        },
      ];
    }

    let events: any[] = [];
    try {
      await connectToDatabase();
      const dbQuery = ProgramEvent.find(query)
        .sort({ order: 1, createdAt: -1 })
        .select(
          "title slug subtitle category shortDescription description startDate startTime endDate endTime date time timezone location venue mapLink bannerUrl thumbnailUrl galleryImages highlights schedule isFeatured contactNumber rsvpLink status order"
        );

      if (limitParam) {
        const limitNum = parseInt(limitParam, 10);
        if (!isNaN(limitNum) && limitNum > 0) {
          dbQuery.limit(limitNum);
        }
      }

      events = await dbQuery.lean();
    } catch (dbErr) {
      console.warn("[Public Events API] Database offline or empty, serving default seed:", dbErr);
    }

    if (!events || events.length === 0) {
      events = defaultEvents;
      if (category && category !== "All Events" && category !== "all") {
        events = events.filter(
          (e) => e.category.toLowerCase() === category.toLowerCase()
        );
      }
    }

    return NextResponse.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error: any) {
    console.error("[Public Events GET Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch events" },
      { status: 500 }
    );
  }
}
