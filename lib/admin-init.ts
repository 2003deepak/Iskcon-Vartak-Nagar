import { connectToDatabase } from "./mongodb";
import AdminUser from "@/models/AdminUser";
import { hashPassword } from "./password";

const DEFAULT_ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL || "admin@iskcon-tvn.org";
const DEFAULT_ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD || "Iskcon@VartakNagar2026!";
const DEFAULT_ADMIN_NAME = process.env.INITIAL_ADMIN_NAME || "Temple Administrator";

/**
 * Ensures at least one active Admin user exists in the database.
 * Call this safely during login checks.
 */
export async function ensureDefaultAdminExists(): Promise<void> {
  try {
    await connectToDatabase();
    const count = await AdminUser.countDocuments();
    if (count === 0) {
      const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
      await AdminUser.create({
        name: DEFAULT_ADMIN_NAME,
        email: DEFAULT_ADMIN_EMAIL.toLowerCase().trim(),
        username: "admin",
        passwordHash,
        role: "superadmin",
        isActive: true,
      });
      console.info(`[Admin Init] Created default admin account: ${DEFAULT_ADMIN_EMAIL}`);
    }
  } catch (error: any) {
    console.warn("[Admin Init] Note on admin check:", error?.message || error);
  }
}
