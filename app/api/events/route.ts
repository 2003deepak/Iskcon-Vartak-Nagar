import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProgramEvent from "@/models/ProgramEvent";

export const dynamic = "force-dynamic";

const defaultEvents = [
  {
    _id: "evt-janmashtami",
    title: "Sri Krishna Janmashtami Mahotsav 2026",
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
    status: "upcoming",
    order: 1,
  },
  {
    _id: "evt-radhashtami",
    title: "Sri Radhashtami Celebrations",
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
    status: "upcoming",
    order: 2,
  },
  {
    _id: "evt-sunday-feast",
    title: "Sunday Love Feast & Spiritual Satsang",
    subtitle: "Weekly Uplifting Spiritual Gathering for Families & Youth",
    category: "Weekly Program",
    date: "Every Sunday",
    time: "5:30 PM – 8:30 PM",
    location: "Satsang Auditorium, ISKCON Vartak Nagar, Thane",
    bannerUrl: "/congregation.jpg",
    description:
      "A weekly tradition established by Srila Prabhupada. Recharge your spiritual battery every Sunday with blissful congregational singing (Kirtan), thought-provoking Bhagavad-gita wisdom class addressing modern life challenges, and a delightful multi-course vegetarian Prasadam feast.",
    highlights: [
      "Soulful Mridanga & Kartal Kirtan",
      "Practical Wisdom Discourse from Bhagavad Gita",
      "Interactive Q&A Session",
      "Free Multi-Course Sanctified Dinner Feast",
    ],
    schedule: [
      { time: "05:30 PM", title: "Joyful Harinam Kirtan" },
      { time: "06:15 PM", title: "Bhagavad Gita Wisdom Discourse & Q&A" },
      { time: "07:30 PM", title: "Sandhya Gaura Aarti" },
      { time: "08:00 PM", title: "Community Love Feast (Prasadam)" },
    ],
    isFeatured: false,
    contactNumber: "+91 93228 81265",
    status: "upcoming",
    order: 3,
  },
  {
    _id: "evt-youth-retreat",
    title: "VOICE Youth Empowerment Seminar",
    subtitle: "Focus, Leadership & Gita Wisdom for Modern Students & Professionals",
    category: "Youth & Kids",
    date: "First & Third Saturday of Every Month",
    time: "6:00 PM – 8:30 PM",
    location: "Youth Center Seminar Room, ISKCON Vartak Nagar",
    bannerUrl: "/books_distribution.jpg",
    description:
      "Designed specifically for college students and working professionals. Learn timeless techniques of mind control, stress management, values-based leadership, and spiritual purpose from ancient Vedic wisdom applied to contemporary life.",
    highlights: [
      "Interactive Mind Management Workshops",
      "Mantra Meditation & Focus Training",
      "Q&A on Career, Relationships & Spirituality",
      "Youth Networking & Delicious Prasadam",
    ],
    schedule: [
      { time: "06:00 PM", title: "Ice Breaking & Meditation Session" },
      { time: "06:30 PM", title: "Dynamic Multimedia Seminar" },
      { time: "07:30 PM", title: "Open Mic Q&A" },
      { time: "08:00 PM", title: "Snacks & Youth Circle" },
    ],
    isFeatured: false,
    contactNumber: "+91 93228 81265",
    status: "upcoming",
    order: 4,
  },
  {
    _id: "evt-kirtan-mela",
    title: "Maha Kirtan Mela – An Evening of Holy Names",
    subtitle: "5 Hours of Continuous Ecstatic Congregational Chanting",
    category: "Kirtan & Seva",
    date: "Upcoming Ekadashi Saturday",
    time: "4:00 PM – 9:00 PM",
    location: "Main Temple Hall, ISKCON Vartak Nagar, Thane",
    bannerUrl: "https://img.youtube.com/vi/OGSaFXdssdQ/maxresdefault.jpg",
    description:
      "Dive into the ocean of the Holy Names! Renowned kirtaniyas and devotees gather for an uninterrupted 5-hour musical meditation featuring traditional mridangas, harmoniums, kartals, and hundreds of singing voices in transcendental unison.",
    highlights: [
      "5 Hours Non-Stop Kirtan with Renowned Kirtaniyas",
      "Traditional Indian Instruments & Melodies",
      "Deep Meditative Absorption",
      "Ekadashi Prasadam Distribution",
    ],
    schedule: [
      { time: "04:00 PM", title: "Opening Prayers & Slow Meditative Chants" },
      { time: "06:00 PM", title: "Uplifting Classical Raga Kirtan" },
      { time: "07:30 PM", title: "High-Energy Dancing Kirtan" },
      { time: "08:45 PM", title: "Concluding Aarti & Ekadashi Prasadam" },
    ],
    isFeatured: false,
    contactNumber: "+91 93228 81265",
    status: "upcoming",
    order: 5,
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    let events: any[] = [];
    let isConnected = false;

    try {
      await connectToDatabase();
      isConnected = true;

      const query: Record<string, any> = { status: "upcoming" };
      if (category && category !== "all") {
        query.category = category;
      }
      if (featured === "true") {
        query.isFeatured = true;
      }

      events = await ProgramEvent.find(query).sort({ order: 1, createdAt: -1 }).lean();

      // Seed database with default events if collection is completely empty
      if (events.length === 0 && (!category || category === "all") && !featured) {
        const count = await ProgramEvent.countDocuments();
        if (count === 0) {
          const inserted = await ProgramEvent.insertMany(
            defaultEvents.map(({ _id, ...rest }) => rest)
          );
          events = inserted.map((doc) => doc.toObject());
        }
      }
    } catch (dbError) {
      console.warn("MongoDB offline/fallback for ProgramEvents:", dbError);
    }

    // Use default fallback events if database returns none
    if (!events || events.length === 0) {
      let filtered = [...defaultEvents];
      if (category && category !== "all") {
        filtered = filtered.filter(
          (e) => e.category.toLowerCase() === category.toLowerCase()
        );
      }
      if (featured === "true") {
        filtered = filtered.filter((e) => e.isFeatured);
      }
      events = filtered;
    }

    return NextResponse.json({
      success: true,
      count: events.length,
      source: isConnected ? "mongodb" : "fallback",
      data: events,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch upcoming events",
      },
      { status: 500 }
    );
  }
}
