"use client";

import { useState } from "react";
import { generatePlan } from "@/app/actions/generatePlan";

type Props = {
  goalId: number;
};

export default function AIGenerateModal({ goalId }: Props) {

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* open button */}
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-2 bg-indigo-600 text-white rounded"
      >
        AIで計画生成
      </button>

      {/* modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded w-96 space-y-4">

            <h2 className="text-lg font-bold">
              AI計画生成
            </h2>

            <form
              action={async (formData) => {
                await generatePlan(goalId, formData);
                setOpen(false);
              }}
              className="space-y-3"
            >

              <input
                name="dailyHours"
                type="number"
                placeholder="1日何時間"
                className="w-full border p-2 rounded"
                required
              />

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded"
              >
                生成
              </button>

            </form>

            <button
              onClick={() => setOpen(false)}
              className="text-sm underline"
            >
              閉じる
            </button>

          </div>

        </div>
      )}
    </>
  );
}