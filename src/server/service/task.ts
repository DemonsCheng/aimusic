import { db } from "@/lib/db";
import { taskTable, InsertTask } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function createTask(task: InsertTask) {
  const result = db.insert(taskTable).values(task);

  return result;
}

export async function updateTask(task: InsertTask) {
  const result = db.insert(taskTable).values(task);

  return result;
}

export async function updateTaskStatus(t_id: string, status: string) {
  const result = db
    .update(taskTable)
    .set({ status: status })
    .where(eq(taskTable.t_id, t_id));

  return result;
}
