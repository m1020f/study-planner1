"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const goalId = Number(formData.get("goalId"));
  const title = String(formData.get("title"));
  const scheduledDate = new Date(String(formData.get("scheduledDate")));
  const estimatedHours = Number(formData.get("estimatedHours"));

  if (!title || !scheduledDate || !estimatedHours) {
    throw new Error("Invalid form data");
  }

  await prisma.task.create({
    data: {
      goalId,
      title,
      scheduledDate,
      estimatedHours,
      status: "todo",
    },
  });

  revalidatePath(`/goals/${goalId}`);
}

export async function updateTaskStatus(
  taskId: number,
  goalId: number,
  status: "todo" | "doing" | "done"
) {
  await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });

  // 詳細ページを再描画
  revalidatePath(`/goals/${goalId}`);
}
