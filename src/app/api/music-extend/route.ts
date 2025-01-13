import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { musicTable } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { SunoAPI } from "@/lib/services/suno-api";
import { R2Storage } from "@/lib/services/r2-storage";
import { auth } from "@/lib/auth/authConfig";

// 定义表单类型
interface NormalFormData {
  type: "normal";
  title: string;
  lyrics: string;
  musicStyle: string;
  audioFile: File;
}

interface InstrumentalFormData {
  type: "instrumental";
  description: string;
  audioFile: File;
}

type FormData = NormalFormData | InstrumentalFormData;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", code: 0 },
        { status: 401 }
      );
    }

    // 获取并解析表单数据
    const formData = await req.formData();
    const formType = formData.get("type") as "normal" | "instrumental";
    const audioFile = formData.get("audioFile") as File | null;

    // 处理音频文件上传
    let uploadedFileUrl = "";
    let sunoAudioId = "";

    if (audioFile) {
      try {
        // 上传到 R2 并获取URL
        uploadedFileUrl = await R2Storage.uploadAudio(audioFile);

        // 上传到Suno获取音频ID
        sunoAudioId = await SunoAPI.uploadReferenceAudio(uploadedFileUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
          { error: "Failed to upload file", code: 0 },
          { status: 500 }
        );
      }
    }

    // 根据表单类型处理生成请求
    let generationParams = {
      action: "upload_extend",
      model: "chirp-v3-5",
      custom: true,
      instrumental: formType === "instrumental",
      title:
        formType === "normal"
          ? (formData.get("title") as string) || "Untitled"
          : "Instrumental Music",
      prompt:
        formType === "normal"
          ? (formData.get("musicStyle") as string)
          : (formData.get("description") as string),
      lyric: formType === "normal" ? (formData.get("lyrics") as string) : "",
      audio_id: sunoAudioId,
    };

    // 调用Suno生成API
    const taskId = await SunoAPI.generateMusic(generationParams);

    // 保存到数据库
    const newMusic = await db
      .insert(musicTable)
      .values({
        suno_id: nanoid(),
        userId: session.user.id,
        taskId: taskId,
        model: "chirp-v3-5",
        title: generationParams.title,
        style: generationParams.prompt,
        lyric: generationParams.lyric,
        prompt: generationParams.prompt,
        audio_url: uploadedFileUrl,
        suno_audio_id: sunoAudioId,
        status: "processing",
        state: "processing",
      })
      .returning();

    return NextResponse.json({
      data: newMusic[0],
      code: 1,
      message: "Music generation started",
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error", code: 0 },
      { status: 500 }
    );
  }
}
