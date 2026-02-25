"use server";

import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";

export async function generatePlan(
  goalId: number,
  formData: FormData
) {

  const dailyHours =
    Number(formData.get("dailyHours"));

  if (!dailyHours) return;

  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
  });

  if (!goal) return;

  const totalHours = goal.totalHours;

  const daysNeeded =
    Math.ceil(totalHours / dailyHours);

  const tasks = [];

  for (let i = 0; i < daysNeeded; i++) {

    tasks.push({
      title: `Day ${i + 1}`,
      scheduledDate: addDays(new Date(), i),
      estimatedHours: dailyHours,
      goalId,
      status: "todo",
    });

  }

  await prisma.task.createMany({
    data: tasks,
  });

}