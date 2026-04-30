import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const savedComparisons = await prisma.savedComparison.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(savedComparisons);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch saved comparisons" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, colleges } = await request.json();
    if (!colleges || !Array.isArray(colleges)) {
      return NextResponse.json({ error: "Invalid colleges array" }, { status: 400 });
    }

    const savedComparison = await prisma.savedComparison.create({
      data: {
        name: name || "My Comparison",
        colleges: JSON.stringify(colleges),
        userId: session.id,
      }
    });
    return NextResponse.json(savedComparison);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save comparison" }, { status: 500 });
  }
}
