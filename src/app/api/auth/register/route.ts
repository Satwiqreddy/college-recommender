import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSalt, hashPassword } from "@/lib/auth";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json({ error: "Password must contain at least one uppercase letter." }, { status: 400 });
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json({ error: "Password must contain at least one number." }, { status: 400 });
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return NextResponse.json({ error: "Password must contain at least one special character." }, { status: 400 });
    }
    if (/(.)\1{2,}/.test(password)) {
      return NextResponse.json({ error: "Password cannot contain 3 or more repeating characters (e.g., aaa, 111)." }, { status: 400 });
    }
    if (/(.)\1(.)\2/.test(password)) {
      return NextResponse.json({ error: "Password cannot contain consecutive repeating pairs (e.g., aabb)." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);
    const finalPassword = `${salt}:${hashedPassword}`; // Store salt and hash together

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: finalPassword,
      },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    await prisma.session.create({
      data: { token, userId: user.id, expiresAt }
    });

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, 
    });

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error: any) {
    console.error("Registration Error Details:", error);
    return NextResponse.json({ error: "Registration failed: " + (error?.message || "Unknown error") }, { status: 500 });
  }
}
