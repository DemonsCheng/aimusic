import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/authConfig";
import { SelectMusic, updateMusic } from "@/server/service/music";
import {
  SunoAPI,
  SunoTaskResponse,
  SunoGenerateResponse,
  SunoItemResponse,
} from "@/lib/services/suno-api";
import { respData } from "@/lib/resp";

export async function GET(req: NextRequest) {
  // const session = await auth();
  // console.log("session", session);
  // const userId = session?.user?.id
  // if (!userId) {
  //     return Response.json({
  //         code: -1,
  //         error: "Not signed in",
  //     });
  // }
  // console.log("userId", userId);

  const userId = "Demons";
  const musicList = await SelectMusic(userId);
  // musicList.filter((song: SelectMusic) => {
  //   console.log("song", song);
  //   if (song.audio_url && song.audio_url.length === 0) {
  //     setRefetch(true);
  //   }
  // });
  // });

  const emptyAudioTasks = [
    ...new Set(
      musicList
        .filter((song) => !song.audio_url || song.audio_url.length === 0)
        .map((song) => song.taskId)
    ),
  ];
  const taskResponseList = await SunoAPI.batchCheckTaskStatus(emptyAudioTasks);
  // console.log("taskResponse", taskResponse);
  // const newMusicList = musicList.map((song) => {
  //   const taskResult = taskResponse.find((task) => task.id === song.taskId);
  //   if (taskResult?.response) {
  //     return {
  //       ...song,
  //       response: taskResult.response,
  //     };
  //   }
  //   return song;
  // });
  // 校验结果
  const newMusicList: SunoItemResponse[] = [];
  taskResponseList.map((task: SunoTaskResponse) => {
    console.log("task", task);
    task.response.data.map((data) => {
      console.log("data", data);
      newMusicList.push(data);
    });
  });
  await Promise.all(
    newMusicList.map(async (song: SunoItemResponse) => {
      if (song.audio_url) {
        await updateMusic({
          userId: "Demons",
          model: "unknown",
          taskId: "123",
          suno_id: song.id,
          audio_url: song.audio_url,
          image_url: song.image_url,
          video_url: song.video_url,
          duration: song.duration,
          state: song.state,
          status: song.state,
        });
      }
    })
  );
  return respData(musicList);
}
