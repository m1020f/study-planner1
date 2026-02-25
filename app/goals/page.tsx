import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function GoalsPage() {
  const goals = await prisma.goal.findMany({
    include: {
      tasks: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">目標一覧</h1>

      <Link
        href="/goals/new"
        className="inline-block px-3 py-2 border rounded mb-4"
      >
        ＋ Goal作成
      </Link>

      <ul className="space-y-4">
        {goals.map((goal) => {
          const totalTasks = goal.tasks.length;
          const doneTasks = goal.tasks.filter(
            (task) => task.status === "done"
          ).length;

          const progress =
            totalTasks === 0
              ? 0
              : Math.round((doneTasks / totalTasks) * 100);

          return (
            <li
              key={goal.id}
              className="border rounded p-4 space-y-3"
            >
              <Link
                href={`/goals/${goal.id}`}
                className="block space-y-2"
              >
                <h2 className="text-lg font-semibold">
                  {goal.title}
                </h2>

                {goal.description && (
                  <p className="text-sm text-gray-600">
                    {goal.description}
                  </p>
                )}

                {/* ===== 進捗 ===== */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>進捗</span>
                    <span>{progress}%</span>
                  </div>

                  <div className="h-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-indigo-500 rounded"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {doneTasks} / {totalTasks} タスク完了
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
