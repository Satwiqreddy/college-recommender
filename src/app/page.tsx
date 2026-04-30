import { prisma } from "@/lib/prisma";
import HomeClient from "./client-page";

// Opt out of caching so the page always shows the latest data
export const dynamic = 'force-dynamic';

export default async function Home() {
  const colleges = await prisma.college.findMany({
    include: {
      courses: true,
    },
    orderBy: {
      rating: 'desc',
    }
  });

  return <HomeClient initialColleges={colleges} />;
}
