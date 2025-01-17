"use server";

import { z } from "zod";
import { InstrumentalFormSchema, NormalFormSchema } from "@/schemas";
import { SunoRequest } from "@/types/suno";
import { createTask } from "@/server/service/task";
import { checkIsAuthenticated } from "@/lib/auth/checkIsAuthenticated";
import { parseServerActionResponse } from "@/lib/utils";
import { SunoMusicResponse } from "@/types/suno";
import { createMusic } from "../service/music";
import { auth } from "@/lib/auth/authConfig";
import { respData, respErr } from "@/lib/resp";
import { SunoAPI } from "@/lib/services/suno-api";

//   // 2. Define a submit handler.
//   export async  function onSubmitNormalForm(values: z.infer<typeof NormalFormSchema>) {
//     // Do something with the form values.
//     // ✅ This will be type-safe and validated.
//     console.log(values);
//   }

export async function handleInstrumentalForm(
  values: z.infer<typeof InstrumentalFormSchema>
) {
  // const isAuthenticated = await checkIsAuthenticated();
  // const session = await auth();
  // const userId = session?.user?.id;

  // if (!isAuthenticated)
  //   return parseServerActionResponse(respErr("Not signed in"));

  // Do something with the form values.
  // ✅ This will be type-safe and validated.
  const { description, title } = values;
  const t_id = crypto.randomUUID();
  const sunoRequest = {
    prompt: description,
    action: "generate",
    model: "chirp-v4",
    title: title,
    custom: false,
    instrumental: true,
    callback_url: process.env.SUNO_API_CALLBACK_URL + "?t_id=" + t_id,
  };

  const task_id = await SunoAPI.generateMusic(sunoRequest);
  console.log("task_id", task_id);

  if (!task_id) {
    return respErr("Failed to generate music");
  }

  // 保存任务信息
  // 上传music到R2
  const task = {
    userId: "Demons",
    t_id: t_id,
    task_id: task_id,
    model: sunoRequest.model,
    action: sunoRequest.action,
    LLM_Params: JSON.stringify(sunoRequest),
    status: "pending",
  };
  const { rowCount } = await createTask(task);
  if (rowCount === 0) {
    return parseServerActionResponse(respErr("create task failed."));
  }

  // 轮询检查任务状态，最多重试30次
  let retryCount = 0;
  let musicList;

  while (retryCount < 10) {
    // 等待1秒
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = await SunoAPI.checkTaskStatus(task_id);

    if (result.response?.success === false) {
      console.error("Failed to check task status:", result);
      return respErr("Failed to check task status");
    }
    musicList = result.response?.data || [];
    if (musicList && musicList.length > 0) {
      break;
    }
    retryCount++;
  }

  if (!musicList || musicList.length === 0) {
    return respErr("No music generated after retries");
  }

  console.log("musicList", musicList);

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
      state: music.state,
    });
  }

  return parseServerActionResponse(respData(musicList));
  //TODO：扣除用户积分
}
