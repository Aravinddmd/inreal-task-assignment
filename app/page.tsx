import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "./actions";
import { AddTask } from "./components/add-task";
import { TaskItem } from "./components/task-item";
import { CheckCircle2, LogOut, ListTodo, CheckSquare } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  const pendingTasks = tasks?.filter((t) => !t.is_completed) || [];
  const completedTasks = tasks?.filter((t) => t.is_completed) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-indigo-600" />
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              TaskFlow
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">
              {user.email}
            </span>
            <form action={signOut}>
              <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <LogOut size={16} />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

     
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Add Task Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Tasks</h2>
          <p className="text-gray-500 mb-6">What needs to be done today?</p>
          <AddTask />
        </div>

        {/* Active Tasks Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <ListTodo className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Active Tasks ({pendingTasks.length})
            </h3>
          </div>

          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}

            {pendingTasks.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-8 text-center">
                <p className="text-sm text-gray-500">
                  No active tasks! Enjoy your day.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Completed ({completedTasks.length})
              </h3>
            </div>

            <div className="space-y-3 opacity-75 hover:opacity-100 transition-opacity">
              {completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
