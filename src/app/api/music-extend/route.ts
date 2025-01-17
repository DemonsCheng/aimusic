import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { musicTable } from "@/lib/db/schema";
import { SunoAPI } from "@/lib/services/suno-api";
import { R2Storage } from "@/lib/services/r2-storage";
import { randomUUID } from "crypto";
import { InsertTask } from "@/lib/db/schema";
import { createTask } from "@/server/service/task";
import { createMusic } from "@/server/service/music";
import { respErr, respOk, respData } from "@/lib/resp";

interface SunoMusicResponse {
  data: Array<{
    id: string;
    lyric: string;
    model: string;
    style: string;
    title: string;
    prompt: string;
    audio_url: string;
    image_url: string;
    video_url: string;
    created_at: string;
  }>;
  success: boolean;
}

export async function POST(req: Request) {
  try {
    // Parse request body as JSON instead of FormData
    const formData = await req.formData();

    const formType = formData.get("type") as "normal" | "instrumental";
    const audioFile = formData.get("audioFile") as File;

    let uploadedFileUrl = "";
    let sunoAudioId = "";
    if (!audioFile) {
      return respErr("No audio file provided");
    }

    if (audioFile) {
      try {
        uploadedFileUrl = await R2Storage.uploadAudio(audioFile);
        const response = await SunoAPI.uploadReferenceAudio(uploadedFileUrl);
        if (!response.success) {
          throw new Error("Failed to upload audio to Suno");
        }
        if (!response.data?.audio_id) {
          throw new Error("No audio ID returned from Suno");
        }
        sunoAudioId = response.data.audio_id;
      } catch (error) {
        console.error("Error uploading file:", error);
        return respErr("Failed to upload file");
      }
    }
    const uuid = randomUUID().toString();
    const generationParams = {
      action: "upload_extend",
      model: "chirp-v3-5",
      custom: formType === "normal",
      instrumental: formType === "instrumental",
      title: formData.get("title")?.toString() || "Untitled",
      prompt:
        formType === "normal"
          ? formData.get("lyrics")?.toString() || ""
          : formData.get("description")?.toString() || "",
      lyric:
        formType === "normal" ? formData.get("lyrics")?.toString() || "" : "",
      style:
        formType === "normal"
          ? formData.get("musicStyle")?.toString() || ""
          : "",
      audio_id: sunoAudioId,
      callback_url: process.env.SUNO_API_CALLBACK_URL + "?t_id=" + uuid,
    };

    const task_id = await SunoAPI.generateMusic(generationParams);

    if (!task_id) {
      return respErr("Failed to generate music");
    }
    // 保存任务信息
    const task: InsertTask = {
      userId: "Demons",
      t_id: uuid,
      task_id: task_id,
      model: generationParams.model,
      action: generationParams.action,
      LLM_Params: JSON.stringify(generationParams),
      status: "pending",
    };
    const { rowCount } = await createTask(task);
    if (rowCount === 0) {
      return respErr("create task failed");
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
        status: "completed",
        state: music.state,
      });
    }

    return respData(musicList);
  } catch (error) {
    console.error("Error processing request:", error);
    return respErr("Internal server error");
  }
}
