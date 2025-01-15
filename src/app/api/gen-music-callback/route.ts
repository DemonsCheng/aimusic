import { NextRequest, NextResponse } from "next/server";
import { SunoCallbackResponse } from "@/types/suno";
import { updateTask, updateTaskStatus } from "@/server/service/task";
import { updateMusic } from "@/server/service/music";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const t_id = searchParams.get("t_id") as string;
  const callbackResponse = (await request.json()) as SunoCallbackResponse;

  console.log(callbackResponse);

  if (!callbackResponse.success) {
    // 更新任务状态为失败
    await updateTaskStatus(t_id, "failed");

    return NextResponse.json({
      success: false,
    });
  }
  const task_id = callbackResponse.task_id;

  await updateTaskStatus(t_id, "success");

  const musicList = callbackResponse.data;
  if (musicList && musicList.length > 0) {
    // Update task with music information
    await Promise.all(
      musicList.map(async (music) => {
        await updateMusic({
          suno_id: music.id,
          taskId: task_id,
          userId: "Demons",
          model: music.model,
          title: music.title,
          lyric: music.lyric,
          style: music.style,
          prompt: music.prompt,
          audio_url: music.audio_url,
          image_url: music.image_url,
          video_url: music.video_url,
          duration: music.duration,
          state: music.state,
          status: music.state === "succeeded" ? "completed" : "failed",
        });
      })
    );
  }
  //TODO：根据回调的返回，修改任务状态。保存音乐信息。
  // 若失败，检查积分表中，做检验后， 则增加用户积分。
  return NextResponse.json({
    success: true,
    message: "success",
  });
}
