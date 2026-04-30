import { prisma } from "@/lib/prisma";
import ProfileClientPage from "./client-page";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const allColleges = await prisma.college.findMany();
  return <ProfileClientPage allColleges={allColleges} />;
}
