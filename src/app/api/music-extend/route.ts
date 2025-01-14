import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { musicTable } from "@/lib/db/schema";
import { SunoAPI } from "@/lib/services/suno-api";
import { R2Storage } from "@/lib/services/r2-storage";
import { randomUUID } from "crypto";
import { InsertTask } from "@/lib/db/schema";
import { createTask } from "@/server/service/task";
import { createMusic } from "@/server/service/music";

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
    // const session = await auth();
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { error: "Unauthorized", code: 0 },
    //     { status: 401 }
    //   );
    // }

    const formData = await req.formData();
    const formType = formData.get("type") as "normal" | "instrumental";
    const audioFile = formData.get("audioFile") as File | null;

    let uploadedFileUrl = "";
    let sunoAudioId = "";

    if (audioFile) {
      try {
        uploadedFileUrl = await R2Storage.uploadAudio(audioFile);
        console.log("Audio URL: ", uploadedFileUrl);
        sunoAudioId = await SunoAPI.uploadReferenceAudio(uploadedFileUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
          { error: "Failed to upload file", code: 0 },
          { status: 500 }
        );
      }
    }

    const uuid = randomUUID().toString();
    const generationParams = {
      action: "upload_extend",
      model: "chirp-v3-5",
      custom: true,
      instrumental: formType === "instrumental",
      title: (formData.get("title") as string) || "Untitled",
      prompt:
        formType === "normal"
          ? (formData.get("lyric") as string)
          : (formData.get("description") as string),
      lyric: formType === "normal" ? (formData.get("lyrics") as string) : "",
      style:
        formType === "normal" ? (formData.get("musicStyle") as string) : "",
      audio_id: sunoAudioId,
      callback_url: process.env.SUNO_API_CALLBACK_URL + "?t_id=" + uuid,
    };

    const task_id = await SunoAPI.generateMusic(generationParams);
    console.log("Response task_id :", task_id);

    if (!task_id) {
      return NextResponse.json(
        { error: "Failed to generate music", code: 0 },
        { status: 500 }
      );
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
      return NextResponse.json({
        success: false,
        message: "create task failed",
      });
    }

    // 轮询检查任务状态，最多重试30次
    let retryCount = 0;
    let musicList;

    while (retryCount < 10) {
      // 等待1秒
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const result = await SunoAPI.checkTaskStatus(task_id);

      if (result.response?.success === false) {
        return NextResponse.json({
          success: false,
          message: "Failed to check task status",
        });
      }
      musicList = result.response?.data || [];
      if (musicList && musicList.length > 0) {
        break;
      }
      console.log("retry: ", retryCount);
      retryCount++;
    }

    if (!musicList || musicList.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No music generated after retries",
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

    return NextResponse.json({
      data: {
        musicList,
      },
      code: 1,
      message: "Music generation started",
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        code: 0,
      },
      { status: 500 }
    );
  }
}
