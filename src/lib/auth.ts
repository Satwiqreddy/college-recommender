import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

// Generate a random salt
export function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

// Hash password with salt
export function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

// Verify password
export function verifyPassword(password: string, hash: string, salt: string) {
  const checkHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return hash === checkHash;
}

// Get active session
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return { id: session.user.id, name: session.user.name, email: session.user.email, role: session.user.role };
}
