"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { addTask } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-400"
    >
      {pending ? "Adding..." : "Add"}
    </button>
  );
}

export function AddTask() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addTask(formData);
        formRef.current?.reset();
      }}
      className="mb-8 flex gap-2"
    >
      <input
        name="title"
        type="text"
        placeholder="Add a new task..."
        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />
      <SubmitButton />
    </form>
  );
}
