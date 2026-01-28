"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function addTask(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;

  if (!title) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("tasks").insert({
    title,
    user_id: user.id,
  });

  if (error) {
    console.error("Error adding task:", error);

    return;
  }

  revalidatePath("/");
}

export async function deleteTask(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  await supabase.from("tasks").delete().eq("id", id);

  revalidatePath("/");
}

export async function toggleTask(id: string, is_completed: boolean) {
  const supabase = await createClient();

  await supabase
    .from("tasks")
    .update({
      is_completed: !is_completed,
    })
    .eq("id", id);

  revalidatePath("/");
}
