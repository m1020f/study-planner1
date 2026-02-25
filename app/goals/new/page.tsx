import Link from "next/link";
import { createGoal } from "./actions";

export default function NewGoalPage() {

  return (
    <div className="p-6 max-w-xl space-y-6">

      <Link
        href="/goals"
        className="text-sm underline"
      >
        ← 一覧に戻る
      </Link>

      <h1 className="text-2xl font-bold">
        Goal作成
      </h1>

      <form
        action={createGoal}
        className="space-y-4 border rounded p-4"
      >

        {/* title */}
        <div>
          <div className="text-sm">
            タイトル
          </div>

          <input
            name="title"
            required
            className="w-full border rounded px-3 py-2"
            placeholder="例：Reactをマスター"
          />
        </div>

        {/* description */}
        <div>
          <div className="text-sm">
            説明
          </div>

          <textarea
            name="description"
            className="w-full border rounded px-3 py-2"
            placeholder="詳細（任意）"
          />
        </div>

        <div>
          <div className="text-sm">目標日</div>

          <input
            type="date"
            name="targetDate"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <div className="text-sm">総時間</div>

          <input
            type="number"
            name="totalHours"
            required
            className="w-full border rounded px-3 py-2"
            placeholder="例：100"
          />
        </div>

        <button className="px-4 py-2 border rounded bg-indigo-500 text-white">
          作成
        </button>

      </form>

    </div>
  );
}

