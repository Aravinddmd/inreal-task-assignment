"use client";

import { deleteTask, toggleTask } from "../actions";
import { Trash2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  is_completed: boolean;
}

export function TaskItem({ task }: { task: Task }) {
  return (
    <div
      className={`group flex items-center justify-between rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${task.is_completed ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200 hover:border-indigo-200"}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <input
          type="checkbox"
          checked={task.is_completed}
          onChange={() => toggleTask(task.id, task.is_completed)}
          className="h-5 w-5 cursor-pointer rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all"
        />
        <span
          className={`text-base font-medium transition-all ${task.is_completed ? "text-gray-400 line-through" : "text-gray-700"}`}
        >
          {task.title}
        </span>
      </div>

      <form action={deleteTask}>
        <input type="hidden" name="id" value={task.id} />

        <button
          type="submit"
          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </form>
    </div>
  );
}
