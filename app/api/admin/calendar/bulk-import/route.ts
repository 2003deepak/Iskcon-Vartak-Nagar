import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import VaishnavEvent from "@/models/VaishnavEvent";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { getCategoryConfig, DEFAULT_EVENT_LOCATION } from "@/lib/calendar-categories";
import { isValidDateString, parseDateString, isValidTimeString } from "@/lib/calendar-date-utils";

interface ImportRowInput {
  title: string;
  dateString: string;
  category?: string;
  color?: string;
  isFast?: boolean | string;
  location?: string;
  paranaDate?: string;
  paranaStartTime?: string;
  paranaEndTime?: string;
  paranaDetails?: {
    date?: string;
    startTime?: string;
    endTime?: string;
  };
}

/**
 * Parses simple CSV content into raw objects
 */
function parseCSV(csvContent: string): Record<string, string>[] {
  const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
  const records: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Regex matching CSV with comma separation respecting quotes
    const rowValues: string[] = [];
    let cur = "";
    let insideQuotes = false;
    for (let charIdx = 0; charIdx < lines[i].length; charIdx++) {
      const char = lines[i][charIdx];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        rowValues.push(cur.trim().replace(/^["']|["']$/g, ""));
        cur = "";
      } else {
        cur += char;
      }
    }
    rowValues.push(cur.trim().replace(/^["']|["']$/g, ""));

    if (rowValues.length > 0 && rowValues.some((v) => v.length > 0)) {
      const rec: Record<string, string> = {};
      headers.forEach((hdr, idx) => {
        rec[hdr] = rowValues[idx] !== undefined ? rowValues[idx] : "";
      });
      records.push(rec);
    }
  }

  return records;
}

/**
 * POST /api/admin/calendar/bulk-import
 * Body:
 * {
 *   mode: "validate" | "import",
 *   format?: "json" | "csv",
 *   rawText?: string,
 *   items?: ImportRowInput[],
 *   skipDuplicates?: boolean
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const adminContext = await getAuthenticatedAdmin(request);
    if (!adminContext) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { mode = "validate", format = "json", rawText, items: inputItems, skipDuplicates = true } = body;

    let rawRows: any[] = [];
    if (format === "csv" && typeof rawText === "string") {
      rawRows = parseCSV(rawText);
    } else if (Array.isArray(inputItems)) {
      rawRows = inputItems;
    } else if (typeof rawText === "string") {
      try {
        const parsed = JSON.parse(rawText);
        rawRows = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return NextResponse.json(
          { success: false, error: "Invalid JSON format provided in raw text." },
          { status: 400 }
        );
      }
    }

    if (rawRows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No records found in payload to process." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Fetch existing events to check for duplicates
    const allExisting = await VaishnavEvent.find({}, { title: 1, dateString: 1, location: 1 }).lean();
    const existingSet = new Set(
      allExisting.map((e) => `${e.dateString}__${(e.title || "").toLowerCase().trim()}__${(e.location || "").toLowerCase().trim()}`)
    );

    const validationResults: Array<{
      rowNumber: number;
      status: "valid" | "invalid" | "duplicate";
      errors: string[];
      sanitizedData: any;
      raw: any;
    }> = [];

    const seenInBatch = new Set<string>();

    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      const rowErrors: string[] = [];

      const title = String(row.title || row.name || row.Title || "").trim();
      const dateString = String(row.dateString || row.date || row.Date || "").trim().slice(0, 10);
      const categoryRaw = String(row.category || row.Category || "festival").toLowerCase().trim();
      const location = String(row.location || row.Location || DEFAULT_EVENT_LOCATION).trim();
      const isFast =
        row.isFast === true ||
        row.isFast === "true" ||
        row.isFast === 1 ||
        row.isFast === "1" ||
        row.isFast === "yes";

      // 1. Title validation
      if (!title) {
        rowErrors.push("Title is required.");
      }

      // 2. Date validation
      if (!dateString || !isValidDateString(dateString)) {
        rowErrors.push(`Invalid date format '${dateString}'. Must be YYYY-MM-DD.`);
      }

      const parsedDate = parseDateString(dateString);
      const year = parsedDate ? parsedDate.year : new Date().getFullYear();

      // 3. Category & Color
      const categoryConfig = getCategoryConfig(categoryRaw);
      const color = row.color || categoryConfig.defaultColor;

      // 4. Parana details
      let paranaDetails: Record<string, string> | null = null;
      if (isFast) {
        const pDate = String(
          row.paranaDate ||
            row.paranaDetails?.date ||
            row["paranaDetails.date"] ||
            ""
        ).trim();
        const pStart = String(
          row.paranaStartTime ||
            row.paranaDetails?.startTime ||
            row["paranaDetails.startTime"] ||
            ""
        ).trim();
        const pEnd = String(
          row.paranaEndTime ||
            row.paranaDetails?.endTime ||
            row["paranaDetails.endTime"] ||
            ""
        ).trim();

        if (pDate && !isValidDateString(pDate)) {
          rowErrors.push(`Parana date '${pDate}' is not a valid YYYY-MM-DD format.`);
        }
        if (pStart && !isValidTimeString(pStart)) {
          rowErrors.push(`Parana start time '${pStart}' is invalid format.`);
        }
        if (pEnd && !isValidTimeString(pEnd)) {
          rowErrors.push(`Parana end time '${pEnd}' is invalid format.`);
        }

        if (pDate || pStart || pEnd) {
          paranaDetails = {
            date: pDate,
            startTime: pStart,
            endTime: pEnd,
          };
        }
      }

      const key = `${dateString}__${title.toLowerCase()}__${location.toLowerCase()}`;
      let status: "valid" | "invalid" | "duplicate" = "valid";

      if (rowErrors.length > 0) {
        status = "invalid";
      } else if (existingSet.has(key) || seenInBatch.has(key)) {
        status = "duplicate";
        rowErrors.push("Record already exists in the database or duplicate in current batch.");
      } else {
        seenInBatch.add(key);
      }

      validationResults.push({
        rowNumber: i + 1,
        status,
        errors: rowErrors,
        raw: row,
        sanitizedData: {
          title,
          dateString,
          year,
          category: categoryConfig.id,
          color,
          isFast,
          location,
          paranaDetails,
          date: isValidDateString(dateString) ? new Date(`${dateString}T00:00:00.000Z`) : null,
        },
      });
    }

    const validCount = validationResults.filter((r) => r.status === "valid").length;
    const invalidCount = validationResults.filter((r) => r.status === "invalid").length;
    const duplicateCount = validationResults.filter((r) => r.status === "duplicate").length;

    // If Mode is Validate Preview
    if (mode === "validate") {
      return NextResponse.json({
        success: true,
        mode: "validate",
        summary: {
          total: validationResults.length,
          valid: validCount,
          invalid: invalidCount,
          duplicates: duplicateCount,
          readyToImport: validCount,
        },
        preview: validationResults,
      });
    }

    // If Mode is Import Confirm
    if (mode === "import") {
      const recordsToInsert = validationResults
        .filter((r) => r.status === "valid")
        .map((r) => r.sanitizedData);

      if (recordsToInsert.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "No valid records eligible for insertion.",
            summary: {
              total: validationResults.length,
              valid: 0,
              invalid: invalidCount,
              duplicates: duplicateCount,
            },
          },
          { status: 400 }
        );
      }

      const insertedDocs = await VaishnavEvent.insertMany(recordsToInsert, { ordered: false });

      return NextResponse.json({
        success: true,
        mode: "import",
        message: `Successfully imported ${insertedDocs.length} calendar records into the database.`,
        summary: {
          totalSubmitted: validationResults.length,
          imported: insertedDocs.length,
          skippedInvalid: invalidCount,
          skippedDuplicates: duplicateCount,
        },
      });
    }

    return NextResponse.json({ success: false, error: "Unsupported mode." }, { status: 400 });
  } catch (error: any) {
    console.error("[Bulk Import Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Bulk import process failed." },
      { status: 500 }
    );
  }
}
