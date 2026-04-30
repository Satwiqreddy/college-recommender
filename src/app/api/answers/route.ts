import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { content, author, questionId } = await request.json();
    if (!content || !author || !questionId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    
    const answer = await prisma.answer.create({
      data: { content, author, questionId }
    });
    return NextResponse.json(answer);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create answer" }, { status: 500 });
  }
}
