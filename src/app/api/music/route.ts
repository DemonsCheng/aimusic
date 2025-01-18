import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/authConfig";
import { SelectMusic, updateMusic } from "@/server/service/music";
import {
  SunoAPI,
  SunoTaskResponse,
  SunoGenerateResponse,
  SunoItemResponse,
} from "@/lib/services/suno-api";
import { respData, respErr } from "@/lib/resp";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return respErr("Not signed in");
  }

  const musicList = await SelectMusic(userId);

  // 获取需要检查状态的任务ID列表
  const emptyAudioTasks = [
    ...new Set(
      musicList
        .filter((song) => !song.audio_url || song.audio_url.length === 0)
        .map((song) => song.taskId)
    ),
  ];

  if (emptyAudioTasks.length === 0) {
    return respData(musicList);
  }

  const taskResponseList = await SunoAPI.batchCheckTaskStatus(emptyAudioTasks);
  const newMusicList: SunoItemResponse[] = [];

  // 添加空值检查和错误处理
  taskResponseList?.forEach((task: SunoTaskResponse) => {
    if (task.response?.success && Array.isArray(task.response.data)) {
      task.response.data.forEach((data) => {
        if (data.audio_url && data.id) {
          newMusicList.push(data);
        }
      });
    } else if (task.response?.error) {
      console.error("Task error:", task.response.error);
    }
  });

  // 更新数据库中的音乐信息
  if (newMusicList.length > 0) {
    await Promise.all(
      newMusicList.map(async (song) => {
        if (song.audio_url) {
          await updateMusic({
            userId,
            model: song.model || "unknown",
            taskId: song.id,
            suno_id: song.id,
            audio_url: song.audio_url,
            image_url: song.image_url || "",
            video_url: song.video_url || "",
            duration: song.duration || 0,
            state: song.state,
            status: song.state,
          });
        }
      })
    );
  }

  // 重新获取更新后的音乐列表
  const updatedMusicList = await SelectMusic(userId);
  return respData(updatedMusicList);
}
