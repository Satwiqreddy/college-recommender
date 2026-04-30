import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        answers: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, author } = await request.json();
    if (!title || !content || !author) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    
    const question = await prisma.question.create({
      data: { title, content, author },
      include: { answers: true }
    });
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}
