import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { SunoRequest } from "@/types/suno";
import { createTask } from "@/server/service/task";
import { respData, respErr } from "@/lib/resp";
import { SunoAPI } from "@/lib/services/suno-api";
import { createMusic } from "@/server/service/music";
import { auth } from "@/lib/auth/authConfig";

export async function POST(request: NextRequest) {
  //TODO：检验用户是否登录
  //校验用户是否有足够的积分
  const session = await auth();
  console.log("session", session);
  const userId = session?.user?.id;
  if (!userId) {
    return respErr("Not signed in");
  }

  const params = await request.json();
  const { type } = params;
  const t_id = crypto.randomUUID();

  const generationParams = {
    action: "upload_extend",
    model: "chirp-v3-5",
    custom: params.formType === "normal",
    instrumental: params.formType === "instrumental",
    title: params.title?.toString() || "Untitled",
    prompt:
      params.formType === "normal"
        ? params.get("lyrics")?.toString() || ""
        : params.get("description")?.toString() || "",
    lyric: params === "normal" ? params.get("lyrics")?.toString() || "" : "",
    style:
      params === "normal" ? params.get("musicStyle")?.toString() || "" : "",
    callback_url: process.env.SUNO_API_CALLBACK_URL + "?t_id=" + t_id,
  };

  const task_id = await SunoAPI.generateMusic(generationParams);
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
    model: generationParams.model,
    action: generationParams.action,
    LLM_Params: JSON.stringify(generationParams),
    status: "pending",
    type: type,
  };
  const { rowCount } = await createTask(task);
  if (rowCount === 0) {
    return respErr("create task failed.");
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
      type: type,
      state: music.state,
    });
  }

  return respData(musicList);
}
