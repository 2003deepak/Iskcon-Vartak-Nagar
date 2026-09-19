import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import VaishnavEvent from "@/models/VaishnavEvent";


const dummyEvents = [
  {
    dateString: "2026-03-03",
    year: 2026,
    title: "Gaura Purnima - Appearance of Sri Chaitanya Mahaprabhu",
    category: "festival",
    isFast: true,
    location: "Mayapur, India",
    paranaDetails: { startTime: "06:20 AM", endTime: "10:15 AM", date: "2026-03-04" },
  },
  {
    dateString: "2026-03-28",
    year: 2026,
    title: "Rama Navami - Appearance of Lord Sri Ramachandra",
    category: "festival",
    isFast: true,
    location: "Ayodhya, India",
    paranaDetails: { startTime: "06:12 AM", endTime: "10:05 AM", date: "2026-03-29" },
  },
  {
    dateString: "2026-05-01",
    year: 2026,
    title: "Nrisimha Caturdasi - Appearance of Lord Nrisimhadeva",
    category: "festival",
    isFast: true,
    location: "Mayapur, India",
    paranaDetails: { startTime: "05:40 AM", endTime: "09:50 AM", date: "2026-05-02" },
  },
  {
    dateString: "2026-09-04",
    year: 2026,
    title: "Sri Krishna Janmashtami",
    category: "festival",
    isFast: true,
    location: "Vrindavan, India",
    paranaDetails: { startTime: "06:05 AM", endTime: "10:00 AM", date: "2026-09-05" },
  },
  {
    dateString: "2026-09-17",
    year: 2026,
    title: "Radhastami - Appearance of Srimati Radharani",
    category: "festival",
    isFast: true,
    location: "Vrindavan, India",
    paranaDetails: { startTime: "06:08 AM", endTime: "10:02 AM", date: "2026-09-18" },
  },
  {
    dateString: "2026-01-14",
    year: 2026,
    title: "Shat-tila Ekadashi",
    category: "tithi",
    isFast: true,
    location: "Mumbai, India",
    paranaDetails: { startTime: "07:14 AM", endTime: "10:45 AM", date: "2026-01-15" },
  },
  {
    dateString: "2026-02-13",
    year: 2026,
    title: "Vijaya Ekadashi",
    category: "tithi",
    isFast: true,
    location: "Mumbai, India",
    paranaDetails: { startTime: "07:05 AM", endTime: "10:42 AM", date: "2026-02-14" },
  },
  {
    dateString: "2026-03-15",
    year: 2026,
    title: "Papamochani Ekadashi",
    category: "tithi",
    isFast: true,
    location: "Mumbai, India",
    paranaDetails: { startTime: "06:44 AM", endTime: "10:33 AM", date: "2026-03-16" },
  },
  {
    dateString: "2026-04-13",
    year: 2026,
    title: "Kamada Ekadashi",
    category: "tithi",
    isFast: true,
    location: "Mumbai, India",
    paranaDetails: { startTime: "06:21 AM", endTime: "10:20 AM", date: "2026-04-14" },
  },
  {
    dateString: "2026-05-12",
    year: 2026,
    title: "Apara Ekadashi",
    category: "tithi",
    isFast: true,
    location: "Mumbai, India",
    paranaDetails: { startTime: "06:03 AM", endTime: "10:12 AM", date: "2026-05-13" },
  },
  {
    dateString: "2026-06-25",
    year: 2026,
    title: "Pandava Nirjala Ekadashi",
    category: "tithi",
    isFast: true,
    location: "Mumbai, India",
    paranaDetails: { startTime: "06:02 AM", endTime: "10:14 AM", date: "2026-06-26" },
  },
  {
    dateString: "2026-11-20",
    year: 2026,
    title: "Utthana Ekadashi",
    category: "tithi",
    isFast: true,
    location: "Mumbai, India",
    paranaDetails: { startTime: "06:48 AM", endTime: "10:30 AM", date: "2026-11-21" },
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedYear = searchParams.get("year");

    let query: Record<string, any> = {};
    if (requestedYear) {
      const yearNum = parseInt(requestedYear);
      query = {
        $or: [
          { year: yearNum },
          { year: requestedYear },
          { dateString: new RegExp(`^${requestedYear}`) },
        ],
      };
    }

    let rawEvents: any[] = [];
    let isConnected = false;

    try {
      const conn = await connectToDatabase();
      isConnected = true;

      // Query Mongoose model
      rawEvents = await VaishnavEvent.find(query).sort({ dateString: 1 }).lean();

      // If no events found, check other possible collection names (e.g. 'events', 'vaishnavevents')
      const db = conn?.connection?.db;
      if ((!rawEvents || rawEvents.length === 0) && db) {
        const collections = await db.listCollections().toArray();
        const colNames = collections.map((c) => c.name);

        const targetColName = colNames.find(
          (n) => n.toLowerCase() === "events" || n.toLowerCase().includes("event")
        );

        if (targetColName && targetColName !== "Events") {
          rawEvents = await db
            .collection(targetColName)
            .find(query)
            .sort({ dateString: 1 })
            .toArray();
        }
      }
    } catch (dbError) {
      console.warn("MongoDB connection offline/failed. Serving fallback dummy events:", dbError);
    }

    // Fallback if database returns no events or DB is offline
    if (!rawEvents || rawEvents.length === 0) {
      rawEvents = requestedYear
        ? dummyEvents.filter((item) => item.year === parseInt(requestedYear))
        : dummyEvents;
    }



    // Transform database records into indexed calendar format
    const eventsMap: Record<
      string,
      {
        name: string;
        description: string;
        color: "amber" | "blue";
        category: string;
        fasting?: string;
        isFast?: boolean;
        location?: string;
        paranaDetails?: any;
      }
    > = {};

    rawEvents.forEach((ev: any) => {
      let fastingStr = "";
      if (ev.paranaDetails?.startTime && ev.paranaDetails?.endTime) {
        fastingStr = `Break fast: ${ev.paranaDetails.startTime} - ${ev.paranaDetails.endTime} (${ev.paranaDetails.date || ev.dateString})`;
      } else if (ev.isFast) {
        fastingStr = "Fasting observed";
      }

      // Map color code to calendar color category ('amber' or 'blue')
      const isEkadashi = ev.category === "tithi" || ev.title?.toLowerCase().includes("ekadasi") || ev.title?.toLowerCase().includes("ekadashi");
      const mappedColor = isEkadashi ? "blue" : "amber";

      eventsMap[ev.dateString] = {
        name: ev.title,
        description: `${ev.title} (${ev.location || "Mumbai, India"})`,
        color: mappedColor,
        category: ev.category || (isEkadashi ? "tithi" : "festival"),
        fasting: fastingStr,
        isFast: ev.isFast,
        location: ev.location,
        paranaDetails: ev.paranaDetails,
      };
    });

    return NextResponse.json({
      success: true,
      count: Object.keys(eventsMap).length,
      source: isConnected ? "mongodb" : "fallback",
      events: eventsMap,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch Vaishnav events" },
      { status: 500 }
    );
  }
}
