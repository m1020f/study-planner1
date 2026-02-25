"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListTodo,
  CalendarDays,
  Target,
} from "lucide-react";

const navItems = [
  {
    label: "ダッシュボード",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "今日のタスク",
    href: "/today",
    icon: ListTodo,
  },
  {
    label: "目標一覧",
    href: "/goals",
    icon: Target,
  },
  {
    label: "カレンダー",
    href: "/calendar",
    icon: CalendarDays,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0 p-4">
      {/* ロゴ */}
      <div className="text-xl font-bold mb-8 text-indigo-600">
        Study Planner
      </div>

      {/* ナビ */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition
                ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}


