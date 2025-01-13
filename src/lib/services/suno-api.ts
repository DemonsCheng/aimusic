import { env } from "@/env.mjs";

interface SunoUploadResponse {
  success: boolean;
  task_id: string;
  data: {
    audio_id: string;
  };
}

interface SunoGenerateResponse {
  success: boolean;
  task_id: string;
  data: {
    track_id: string;
  };
}

interface SunoTaskStatusResponse {
  success: boolean;
  data: {
    status: "pending" | "processing" | "completed" | "failed";
    result?: {
      audio_url: string;
      duration: number;
    };
  };
}

interface GenerateMusicParams {
  action: string;
  model: string;
  custom: boolean;
  instrumental: boolean;
  title: string;
  prompt: string;
  lyric: string;
  audio_id: string;
}

export class SunoAPI {
  private static readonly BASE_URL = "https://api.acedata.cloud/suno";
  private static readonly TOKEN = env.SUNO_API_TOKEN;

  static async uploadReferenceAudio(audioUrl: string): Promise<string> {
    try {
      const response = await fetch(`${this.BASE_URL}/upload`, {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${this.TOKEN}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ audio_url: audioUrl }),
      });

      if (!response.ok) {
        throw new Error(`Suno API error: ${response.statusText}`);
      }

      const data = (await response.json()) as SunoUploadResponse;

      if (!data.success) {
        throw new Error("Failed to upload audio to Suno");
      }

      return data.data.audio_id;
    } catch (error) {
      console.error("Error uploading to Suno:", error);
      throw error;
    }
  }

  static async generateMusic(params: GenerateMusicParams): Promise<string> {
    try {
      const response = await fetch(`${this.BASE_URL}/generate`, {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${this.TOKEN}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Suno API error: ${response.statusText}`);
      }

      const data = (await response.json()) as SunoGenerateResponse;

      if (!data.success) {
        throw new Error("Failed to generate music");
      }

      return data.task_id;
    } catch (error) {
      console.error("Error generating music:", error);
      throw error;
    }
  }

  static async checkTaskStatus(
    taskId: string
  ): Promise<SunoTaskStatusResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/tasks/${taskId}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${this.TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Suno API error: ${response.statusText}`);
      }

      const data = (await response.json()) as SunoTaskStatusResponse;

      if (!data.success) {
        throw new Error("Failed to check task status");
      }

      return data;
    } catch (error) {
      console.error("Error checking task status:", error);
      throw error;
    }
  }
}
