import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  startOfDay,
  endOfDay,
  isPast,
  isToday,
} from "date-fns";

export default async function Dashboard() {

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  /* 今日のタスク */
  const todayTasks = await prisma.task.findMany({
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

  /* 期限切れタスク */
  const overdueTasks = await prisma.task.findMany({
    where: {
      scheduledDate: {
        lt: todayStart,
      },
      status: {
        not: "done",
      },
    },
    include: {
      goal: true,
    },
    orderBy: {
      scheduledDate: "asc",
    },
  });

  /* Goal一覧 */
  const goals = await prisma.goal.findMany({
    include: {
      tasks: true,
    },
  });

  /* 統計 */
  const totalToday = todayTasks.length;

  const doneToday = todayTasks.filter(
    (t) => t.status === "done"
  ).length;

  const progress =
    totalToday === 0
      ? 0
      : Math.round((doneToday / totalToday) * 100);

  const activeGoals = goals.filter(
    (g) =>
      g.tasks.length === 0 ||
      g.tasks.some((t) => t.status !== "done")
  ).length;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        ダッシュボード
      </h1>

      {/* stats */}
      <div className="grid grid-cols-4 gap-4">

        <StatCard
          title="今日のタスク"
          value={totalToday}
        />

        <StatCard
          title="完了"
          value={`${doneToday}`}
        />

        <StatCard
          title="完了率"
          value={`${progress}%`}
        />

        <StatCard
          title="進行中Goal"
          value={activeGoals}
        />

      </div>

      {/* 今日のタスク */}
      <Section title="今日のタスク">

        {todayTasks.length === 0 && (
          <Empty text="今日のタスクはありません" />
        )}

        {todayTasks.map((task) => (

          <TaskRow
            key={task.id}
            task={task}
          />

        ))}

      </Section>

      {/* 期限切れ */}
      <Section title="期限切れ">

        {overdueTasks.length === 0 && (
          <Empty text="期限切れタスクはありません" />
        )}

        {overdueTasks.map((task) => (

          <TaskRow
            key={task.id}
            task={task}
            overdue
          />

        ))}

      </Section>

    </div>
  );
}

/* ---------- components ---------- */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="border rounded p-4">

      <div className="text-sm text-gray-500">
        {title}
      </div>

      <div className="text-2xl font-bold">
        {value}
      </div>

    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded p-4 space-y-3">

      <h2 className="font-semibold">
        {title}
      </h2>

      {children}

    </div>
  );
}

function Empty({
  text,
}: {
  text: string;
}) {
  return (
    <div className="text-sm text-gray-400">
      {text}
    </div>
  );
}

function TaskRow({
  task,
  overdue,
}: {
  task: any;
  overdue?: boolean;
}) {
  return (

    <Link
      href={`/goals/${task.goalId}`}
      className={`block border rounded p-3 hover:bg-gray-50

        ${overdue ? "border-red-400 bg-red-50" : ""}
      `}
    >

      <div className="flex justify-between">

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

          <div className="text-xs text-gray-500">

            {task.goal.title}

            {" / "}

            {task.scheduledDate.toLocaleDateString()}

          </div>

        </div>

        {task.status === "done" && (
          <div className="text-green-600 text-xs">
            完了
          </div>
        )}

      </div>

    </Link>

  );
}