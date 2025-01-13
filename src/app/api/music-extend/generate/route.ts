import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { musicTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SunoAPI } from "@/lib/services/suno-api";
import { auth } from "@/lib/auth/authConfig";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", code: 0 },
        { status: 401 }
      );
    }

    const { musicId } = await req.json();

    // Get music record
    const [music] = await db
      .select()
      .from(musicTable)
      .where(eq(musicTable.id, musicId));

    if (!music) {
      return NextResponse.json(
        { error: "Music not found", code: 0 },
        { status: 404 }
      );
    }

    // Start generation
    const taskId = await SunoAPI.generateMusic({
      audioId: music.suno_audio_id || undefined,
      title: music.title || "Untitled",
      style: music.style || "",
      lyrics: music.lyric,
      description: music.prompt,
    });

    // Update music record with task ID
    await db
      .update(musicTable)
      .set({
        taskId,
        status: "processing",
        updated_at: new Date().toISOString(),
      })
      .where(eq(musicTable.id, musicId));

    return NextResponse.json({
      data: { taskId },
      code: 1,
      message: "Music generation started",
    });
  } catch (error) {
    console.error("Error generating music:", error);
    return NextResponse.json(
      { error: "Internal server error", code: 0 },
      { status: 500 }
    );
  }
}

// Status check endpoint
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", code: 0 },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");
    const musicId = searchParams.get("musicId");

    if (!taskId || !musicId) {
      return NextResponse.json(
        { error: "Missing taskId or musicId", code: 0 },
        { status: 400 }
      );
    }

    const status = await SunoAPI.checkTaskStatus(taskId);

    if (status.data.status === "completed" && status.data.result) {
      // Update music record with result
      await db
        .update(musicTable)
        .set({
          audio_url: status.data.result.audio_url,
          duration: status.data.result.duration,
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .where(eq(musicTable.id, parseInt(musicId)));
    } else if (status.data.status === "failed") {
      await db
        .update(musicTable)
        .set({
          status: "failed",
          updated_at: new Date().toISOString(),
        })
        .where(eq(musicTable.id, parseInt(musicId)));
    }

    return NextResponse.json({
      data: status.data,
      code: 1,
    });
  } catch (error) {
    console.error("Error checking status:", error);
    return NextResponse.json(
      { error: "Internal server error", code: 0 },
      { status: 500 }
    );
  }
}
