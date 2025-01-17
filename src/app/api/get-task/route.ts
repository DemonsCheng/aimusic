import { SunoAPI } from "@/lib/services/suno-api";
import { createMusic } from "@/server/service/music";
import { NextResponse } from "next/server";
import { respErr } from "@/lib/resp";
import { auth } from "@/lib/auth/authConfig";

export async function GET(req: Request) {
  try {
    const session = await auth();
    console.log("session", session);
    const userId = session?.user?.id;
    if (!userId) {
      return respErr("Not signed in");
    }
    const formData = await req.formData();
    const task_id = formData.get("task_id") as string;
    if (!task_id) {
      return respErr("No task_id provided");
    }
    const result = await SunoAPI.checkTaskStatus(task_id);

    if (result.response?.success === false) {
      return NextResponse.json({
        success: false,
        message: "Failed to check task status",
      });
    }

    const musicList = result.response.data;
    if (!musicList || musicList.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No music generated",
      });
    }

    // Save each generated music to database
    for (const music of musicList) {
      await createMusic({
        userId: "Demons",
        taskId: task_id,
        suno_id: music.id,
        title: music.title,
        style: music.style,
        lyric: music.lyric,
        prompt: music.prompt || "",
        audio_url: music.audio_url,
        image_url: music.image_url,
        video_url: music.video_url,
        duration: music.duration,
        model: music.model,
        status: "completed",
        state: music.state,
      });
    }
  } catch (error) {}
}
