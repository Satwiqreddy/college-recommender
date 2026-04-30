import { prisma } from "@/lib/prisma";
import PredictorClientPage from "./client-page";

export const dynamic = 'force-dynamic';

export default async function PredictorPage() {
  const allColleges = await prisma.college.findMany({
    orderBy: { ranking: 'asc' },
  });

  return <PredictorClientPage allColleges={allColleges} />;
}
