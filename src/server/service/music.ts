import { db } from "@/lib/db";
import { musicTable ,InsertMusic} from "@/lib/db/schema";
import { eq,desc } from 'drizzle-orm'


export async function SelectMusic(userId: string){
    const result =  await db.select().from(musicTable)
    // .where(eq(musicTable.userId, userId))
    .orderBy(desc(musicTable.created_at)).limit(10);
    return result
}


export async function createMusic(music: InsertMusic){
    const result =  db.insert(musicTable).values(music);

    return result
}

