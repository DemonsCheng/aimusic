import { db } from "@/lib/db";
import { musicTable, InsertMusic } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function SelectMusic(userId: string) {
  const result = await db
    .select()
    .from(musicTable)
    .where(eq(musicTable.userId, userId))
    .orderBy(desc(musicTable.created_at))
    .limit(10);
  return result;
}

export async function createMusic(music: InsertMusic) {
  const result = db.insert(musicTable).values(music);

  return result;
}

export async function updateMusic(music: InsertMusic) {
  const result = db
    .update(musicTable)
    .set({
      audio_url: music.audio_url,
      image_url: music.image_url,
      video_url: music.video_url,
      duration: music.duration,
      state: music.state,
      status: music.status,
    })
    .where(eq(musicTable.suno_id, music.suno_id));

  return result;
}
