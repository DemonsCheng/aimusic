import { db } from "@/lib/db";
import { taskTable ,InsertTask} from "@/lib/db/schema";



export async function createTask(task: InsertTask){
    const result =  db.insert(taskTable).values(task);

    return result
}
