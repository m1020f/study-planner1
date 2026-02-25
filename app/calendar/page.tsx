import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
} from "date-fns";

type Props = {
  searchParams: Promise<{
    year?: string;
    month?: string;
  }>;
};

const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

export default async function CalendarPage({ searchParams }: Props) {

  const params = await searchParams;

  const now = new Date();

  const year =
    params.year
      ? Number(params.year)
      : now.getFullYear();

  const month =
    params.month
      ? Number(params.month) - 1
      : now.getMonth();

  const currentDate = new Date(year, month, 1);

  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);

  const days = eachDayOfInterval({ start, end });

  /* ===== 前月・次月 ===== */
  const prevMonth = new Date(year, month - 1, 1);
  const nextMonth = new Date(year, month + 1, 1);

  /* ===== Tasks ===== */
  const tasks = await prisma.task.findMany({
    where: {
      scheduledDate: {
        gte: start,
        lte: end,
      },
    },
    include: {
      goal: true,
    },
    orderBy: {
      scheduledDate: "asc",
    },
  });

  return (
    <div className="p-6 space-y-6">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center">
        <Link
          href={`/calendar?year=${prevMonth.getFullYear()}&month=${
            prevMonth.getMonth() + 1
          }`}
          className="text-sm underline"
        >
          ← 前月
        </Link>

        <h1 className="text-xl font-semibold">
          {format(currentDate, "yyyy年MM月")}
        </h1>

        <Link
          href={`/calendar?year=${nextMonth.getFullYear()}&month=${
            nextMonth.getMonth() + 1
          }`}
          className="text-sm underline"
        >
          次月 →
        </Link>
      </div>

      {/* ===== Weekday Header ===== */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-600">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={
              index === 0
                ? "text-red-500"
                : index === 6
                ? "text-blue-500"
                : ""
            }
          >
            {day}
          </div>
        ))}
      </div>

      {/* ===== Calendar Grid ===== */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayTasks = tasks.filter((task) =>
            isSameDay(task.scheduledDate, day)
          );

          return (
            <div
              key={day.toISOString()}
              className={`border rounded p-2 min-h-[110px] ${
                isToday(day) ? "border-indigo-500 bg-indigo-50" : ""
              }`}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  isToday(day)
                    ? "text-indigo-600 font-bold"
                    : ""
                }`}
              >
                {format(day, "d")}
              </div>

              <div className="space-y-1">
                {dayTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/goals/${task.goalId}`}
                    className={`block text-xs px-2 py-1 rounded ${
                      task.status === "done"
                        ? "bg-gray-200 text-gray-500 line-through"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {task.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


