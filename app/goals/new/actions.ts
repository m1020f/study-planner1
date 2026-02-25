"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createGoal(formData: FormData) {

  const title =
    formData.get("title")?.toString() ?? "";

  const description =
    formData.get("description")?.toString() ?? "";

  const targetDate =
    formData.get("targetDate")?.toString();

  const totalHours =
    Number(formData.get("totalHours"));

  if (!title || !targetDate || !totalHours) return;

  await prisma.goal.create({
    data: {
      title,
      description,
      targetDate: new Date(targetDate),
      totalHours,
    },
  });

  redirect("/goals");
}