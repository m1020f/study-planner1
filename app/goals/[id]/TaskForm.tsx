import { createTask } from "./actions";

type Props = {
  goalId: number;
};

export default function TaskForm({ goalId }: Props) {
  return (
    <form
      action={createTask}
      className="border rounded p-4 space-y-3"
    >
      <h2 className="font-semibold">タスク追加</h2>

      <input type="hidden" name="goalId" value={goalId} />

      <div>
        <input
          name="title"
          placeholder="タスク名"
          className="border px-3 py-2 rounded w-full"
          required
        />
      </div>

      <div className="flex gap-2">
        <input
          type="date"
          name="scheduledDate"
          className="border px-3 py-2 rounded"
          required
        />

        <input
          type="number"
          name="estimatedHours"
          min={1}
          className="border px-3 py-2 rounded w-24"
          placeholder="時間"
          required
        />
      </div>

      <button className="border px-4 py-2 rounded bg-gray-100">
        追加
      </button>
    </form>
  );
}
