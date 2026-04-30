import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(savedColleges);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch saved colleges" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { collegeId } = await request.json();
    if (!collegeId) return NextResponse.json({ error: "Missing collegeId" }, { status: 400 });

    const existing = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId: session.id, collegeId } }
    });

    if (existing) {
      await prisma.savedCollege.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false });
    } else {
      await prisma.savedCollege.create({
        data: { userId: session.id, collegeId }
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle saved college" }, { status: 500 });
  }
}
