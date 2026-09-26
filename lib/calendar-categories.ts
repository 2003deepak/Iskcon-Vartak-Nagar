/**
 * Controlled Category System for Vaishnava Calendar
 * Keeps categories structured, extensible, and visually consistent across the application.
 */

export interface CalendarCategoryConfig {
  id: string;
  name: string;
  description: string;
  defaultColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  defaultIsFast: boolean;
  iconName?: string;
}

export const CALENDAR_CATEGORIES: CalendarCategoryConfig[] = [
  {
    id: "festival",
    name: "Festival",
    description: "Major Vaishnava festival, celebration or holy occasion (e.g. Janmashtami, Gaura Purnima, Rama Navami)",
    defaultColor: "#d97706", // Amber / Saffron
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-400",
    badgeBorder: "border-amber-500/30",
    defaultIsFast: true,
  },
  {
    id: "ekadashi",
    name: "Ekadashi",
    description: "Fortnightly sacred Vaishnava fasting day dedicated to Lord Vishnu / Krishna",
    defaultColor: "#2563eb", // Royal Blue
    badgeBg: "bg-blue-500/15",
    badgeText: "text-blue-400",
    badgeBorder: "border-blue-500/30",
    defaultIsFast: true,
  },
  {
    id: "mahadvadasi",
    name: "Maha-Dvadasi",
    description: "Special auspicious dvadasi observance carrying extraordinary spiritual merit",
    defaultColor: "#7c3aed", // Rich Purple
    badgeBg: "bg-purple-500/15",
    badgeText: "text-purple-400",
    badgeBorder: "border-purple-500/30",
    defaultIsFast: true,
  },
  {
    id: "appearance",
    name: "Appearance Day",
    description: "Advent / Appearance day of the Supreme Lord or an exalted Acarya (Avirbhava)",
    defaultColor: "#059669", // Emerald Green
    badgeBg: "bg-emerald-500/15",
    badgeText: "text-emerald-400",
    badgeBorder: "border-emerald-500/30",
    defaultIsFast: false,
  },
  {
    id: "disappearance",
    name: "Disappearance Day",
    description: "Sacred passing / Tirobhava observance of an exalted Vaishnava saint or Acarya",
    defaultColor: "#64748b", // Slate Grey
    badgeBg: "bg-slate-500/15",
    badgeText: "text-slate-300",
    badgeBorder: "border-slate-500/30",
    defaultIsFast: false,
  },
  {
    id: "fast",
    name: "Fasting Day",
    description: "Specific holy day with obligatory fasting restrictions",
    defaultColor: "#e11d48", // Crimson Rose
    badgeBg: "bg-rose-500/15",
    badgeText: "text-rose-400",
    badgeBorder: "border-rose-500/30",
    defaultIsFast: true,
  },
  {
    id: "special",
    name: "Special Observance",
    description: "Other significant temple rituals, Ratha Yatra, seasonal celebrations or events",
    defaultColor: "#0891b2", // Cyan
    badgeBg: "bg-cyan-500/15",
    badgeText: "text-cyan-400",
    badgeBorder: "border-cyan-500/30",
    defaultIsFast: false,
  },
];

export const DEFAULT_CATEGORY_ID = "festival";
export const DEFAULT_EVENT_LOCATION = "Mumbai, India";

/**
 * Validates if a category ID is in the controlled list.
 */
export function isValidCategoryId(categoryId: string): boolean {
  if (!categoryId) return false;
  return CALENDAR_CATEGORIES.some((c) => c.id.toLowerCase() === categoryId.toLowerCase());
}

/**
 * Retrieves configuration metadata for a category with safe fallback.
 */
export function getCategoryConfig(categoryId?: string): CalendarCategoryConfig {
  if (!categoryId) {
    return CALENDAR_CATEGORIES[0];
  }
  const match = CALENDAR_CATEGORIES.find(
    (c) => c.id.toLowerCase() === categoryId.toLowerCase()
  );
  if (match) return match;

  // Fallback for custom or legacy categories
  return {
    id: categoryId,
    name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
    description: "Custom calendar category",
    defaultColor: "#d97706",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-400",
    badgeBorder: "border-amber-500/30",
    defaultIsFast: false,
  };
}
