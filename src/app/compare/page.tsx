import { prisma } from "@/lib/prisma";
import CompareClientPage from "./client-page";

export const dynamic = 'force-dynamic';

export default async function ComparePage() {
  const allColleges = await prisma.college.findMany({
    orderBy: { name: 'asc' },
  });

  return <CompareClientPage allColleges={allColleges} />;
}
