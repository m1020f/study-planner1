import { prisma } from "@/lib/prisma";
import Link from "next/link";
import TaskForm from "./TaskForm";
import { updateTaskStatus } from "./actions";
import { startOfDay, isToday, isPast } from "date-fns";
import AIGenerateModal from "@/components/AIGenerateModal";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GoalDetail({ params }: Props) {

  /* ✅ Next.js 16 必須 */
  const { id } = await params;

  const goalId = Number(id);

  /* 安全チェック */
  if (!goalId) {
    return <div className="p-6">Invalid Goal ID</div>;
  }

  const today = startOfDay(new Date());

  const goal = await prisma.goal.findUnique({
    where: {
      id: goalId,
    },
    include: {
      tasks: {
        orderBy: {
          scheduledDate: "asc",
        },
      },
    },
  });

  if (!goal) {
    return <div className="p-6">Goal not found</div>;
  }

  /* progress */
  const total = goal.tasks.length;

  const done = goal.tasks.filter(
    (t) => t.status === "done"
  ).length;

  const progress =
    total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="p-6 space-y-6">

      <Link href="/goals" className="text-sm underline">
        ← 一覧に戻る
      </Link>

      {/* Goal info */}
      <div className="border rounded p-4 space-y-3">

        <h1 className="text-2xl font-bold">
          {goal.title}
        </h1>

        {goal.description && (
          <p className="text-gray-600">
            {goal.description}
          </p>
        )}

        {/* progress bar */}
        <div>
          <div className="flex justify-between text-sm">
            <span>進捗</span>
            <span>{progress}%</span>
          </div>

          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-indigo-500 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>

      {/* Task Form */}
      <TaskForm goalId={goal.id} />

      <AIGenerateModal goalId={goal.id} />

      {/* Task List */}
      <ul className="space-y-2">

        {goal.tasks.map((task) => {

          const todayFlag = isToday(task.scheduledDate);

          const overdue =
            isPast(task.scheduledDate) &&
            !todayFlag &&
            task.status !== "done";

          return (
            <li
              key={task.id}
              className={`border rounded p-3 flex justify-between

                ${todayFlag ? "border-indigo-500 bg-indigo-50" : ""}
                ${overdue ? "border-red-400 bg-red-50" : ""}
              `}
            >

              <div>

                <div
                  className={
                    task.status === "done"
                      ? "line-through text-gray-400"
                      : ""
                  }
                >
                  {task.title}
                </div>

                <div className="text-sm text-gray-500">

                  {task.scheduledDate.toLocaleDateString()}

                  {todayFlag && (
                    <span className="ml-2 text-indigo-600 text-xs">
                      今日
                    </span>
                  )}

                  {overdue && (
                    <span className="ml-2 text-red-600 text-xs">
                      期限切れ
                    </span>
                  )}

                  {" / "}
                  {task.estimatedHours}h

                </div>

              </div>

              <form
                action={async () => {
                  "use server";

                  await updateTaskStatus(
                    task.id,
                    goal.id,
                    task.status === "done"
                      ? "todo"
                      : "done"
                  );
                }}
              >
                <button className="text-xs px-3 py-1 border rounded">
                  {task.status === "done"
                    ? "未完了"
                    : "完了"}
                </button>
              </form>

            </li>
          );
        })}

      </ul>

    </div>
  );
}