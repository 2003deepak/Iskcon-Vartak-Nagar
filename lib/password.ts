import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hash a plain text password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain text password against a bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

export interface PasswordValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validates password strength:
 * - At least 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number or special character
 */
export function validatePasswordStrength(password: string): PasswordValidationResult {
  if (!password || typeof password !== "string") {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Password must include at least one uppercase letter" };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "Password must include at least one lowercase letter" };
  }

  if (!/[0-9]/.test(password) && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: "Password must include at least one number or special symbol" };
  }

  return { isValid: true };
}
