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
import { respErr } from "@/lib/resp";

//   // 2. Define a submit handler.
//   export async  function onSubmitNormalForm(values: z.infer<typeof NormalFormSchema>) {
//     // Do something with the form values.
//     // ✅ This will be type-safe and validated.
//     console.log(values);
//   }

export async function handleMusicExtendForm(
  values: z.infer<typeof InstrumentalFormSchema>
) {
  const isAuthenticated = await checkIsAuthenticated();
  const session = await auth();
  const userId = session?.user?.id;

  if (!isAuthenticated)
    return parseServerActionResponse(respErr("Not signed in"));

  // Do something with the form values.
  // ✅ This will be type-safe and validated.
  console.log("Action:", values);
  const { description, title } = values;
  const t_id = crypto.randomUUID();
  const sunoRequest: SunoRequest = {
    prompt: description,
    action: "generate",
    model: "chirp-v4",
    title: title,
    custom: false,
    instrumental: true,
  };

  const options = {
    method: "post",
    headers: {
      authorization: "Bearer " + process.env.SUNO_API_KEY,
      "content-type": "application/json",
    },
    timeout: 1200000,
    body: JSON.stringify(sunoRequest),
  };

  const response = await fetch(
    "https://api.acedata.cloud/suno/audios",
    options
  );

  const data = (await response.json()) as {
    success: boolean;
    task_id?: string;
    trace_id?: string;
    data?: SunoMusicResponse[];
  };
  console.log("data", data);
  if (!data.success) {
    return parseServerActionResponse({
      error: data.trace_id,
      status: "ERROR",
    });
  }
  let taskId = "";
  if (data?.task_id) {
    taskId = data.task_id;
    console.log("taskId", taskId);
    console.log("data", data);
    console.log("musiclist", data.data);
  }

  // 保存任务信息
  // 上传music到R2
  const task = {
    userId: "Demons",
    t_id: t_id,
    task_id: taskId,
    model: sunoRequest.model,
    action: sunoRequest.action,
    LLM_Params: JSON.stringify(sunoRequest),
    status: "pending",
  };
  const { rowCount } = await createTask(task);
  if (rowCount === 0) {
    return parseServerActionResponse({
      success: false,
      message: "create music failed",
    });
  }

  const musicList = data.data;
  // 保存音乐到数据库
  if (musicList?.length !== 0) {
    musicList?.map(async (music) => {
      const {
        id,
        audio_url,
        image_url,
        video_url,
        duration,
        lyric,
        prompt,
        title,
        style,
        model,
        state,
      } = music;
      const musicInfo = {
        suno_id: id,
        userId: userId,
        taskId: taskId,
        lyric,
        audio_url,
        image_url,
        video_url,
        duration,
        state,
        prompt,
        title,
        style,
        model,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const { rowCount } = await createMusic({
        ...musicInfo,
        userId: userId ?? "",
        suno_id: id,
      });
      if (rowCount === 0) {
        console.error(`create music ${id} failed`);
      }
    });
  }

  return parseServerActionResponse({
    code: 1,
    data: musicList,
    status: "SUCCESS",
  });
  //TODO：扣除用户积分
}
