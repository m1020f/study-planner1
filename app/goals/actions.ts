"use server";

import { prisma } from "@/lib/prisma";

export async function createGoal(formData: FormData) {
  const title = formData.get("title") as string;
  await prisma.goal.create({
    data: {
      title,
      targetDate: new Date(),
      totalHours: 0,
    },
  });
}
