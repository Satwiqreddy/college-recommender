"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateCollegeImages(id: string, imageUrl: string, logoUrl: string) {
  try {
    await prisma.college.update({
      where: { id },
      data: {
        imageUrl,
        logoUrl,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/college/${id}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating college images:", error);
    return { success: false, error: "Failed to update images" };
  }
}
