import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { startOfDay, endOfDay, isPast, isToday } from "date-fns";
import { updateTaskStatus } from "../goals/[id]/actions";

export default async function TodayPage() {

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  /* 今日のタスク取得 */
  const tasks = await prisma.task.findMany({
    where: {
      scheduledDate: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
    include: {
      goal: true,
    },
    orderBy: {
      scheduledDate: "asc",
    },
  });

  /* 未完了タスク数 */
  const remaining = tasks.filter(
    t => t.status !== "done"
  ).length;

  const completed = tasks.filter(
    t => t.status === "done"
  ).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completed / tasks.length) * 100);

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        今日のタスク
      </h1>

      {/* progress */}
      <div className="border rounded p-4 space-y-2">

        <div className="flex justify-between text-sm">
          <span>
            完了 {completed} / {tasks.length}
          </span>
          <span>{progress}%</span>
        </div>

        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-indigo-500 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>

      {/* empty */}
      {tasks.length === 0 && (
        <div className="text-gray-500">
          今日のタスクはありません
        </div>
      )}

      {/* list */}
      <ul className="space-y-3">

        {tasks.map(task => {

          const overdue =
            isPast(task.scheduledDate) &&
            !isToday(task.scheduledDate) &&
            task.status !== "done";

          return (
            <li
              key={task.id}
              className={`
                border rounded p-4 flex justify-between

                ${task.status === "done"
                  ? "bg-gray-50"
                  : "bg-white"
                }

                ${overdue
                  ? "border-red-400"
                  : "border-gray-200"
                }
              `}
            >

              <div>

                <Link
                  href={`/goals/${task.goalId}`}
                  className="text-sm text-indigo-600"
                >
                  {task.goal.title}
                </Link>

                <div
                  className={
                    task.status === "done"
                      ? "line-through text-gray-400"
                      : ""
                  }
                >
                  {task.title}
                </div>

                <div className="text-xs text-gray-500">
                  {task.estimatedHours} 時間
                </div>

              </div>

              <form
                action={async () => {
                  "use server";

                  await updateTaskStatus(
                    task.id,
                    task.goalId,
                    task.status === "done"
                      ? "todo"
                      : "done"
                  );
                }}
              >
                <button className="text-xs px-3 py-1 border rounded">
                  {task.status === "done"
                    ? "未完了"
                    : "完了"
                  }
                </button>
              </form>

            </li>
          );

        })}

      </ul>

    </div>
  );

}