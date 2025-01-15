interface SunoUploadResponse {
  success: boolean;
  task_id: string;
  data: {
    audio_id: string;
  };
}

export interface SunoGenerateResponse {
  success: boolean;
  task_id: string;
  trace_id: string;
  error?: {
    code: string;
    message: string;
  };
  data: SunoItemResponse[];
}

export interface SunoItemResponse {
  id: string;
  title: string;
  image_url: string;
  lyric: string;
  audio_url: string;
  video_url: string;
  created_at: string;
  model: string;
  state: "succeeded" | "failed";
  prompt: string | null;
  style: string;
  duration: number;
}

export interface SunoTaskResponse {
  _id: string;
  id: string;
  api_id: string;
  application_id: string;
  created_at: number;
  credential_id: string;
  request: {
    action: string;
    model: string;
    custom: boolean;
    instrumental: boolean;
    title: string;
    prompt: string | null;
    lyric: string;
    style: string;
    audio_id: string;
    callback_url: string;
  };
  trace_id: string;
  user_id: string;
  response: SunoGenerateResponse;
}

interface GenerateMusicParams {
  action: string;
  model: string;
  prompt: string;
  lyric?: string;
  custom?: boolean;
  instrumental?: boolean;
  title?: string;
  style?: string;
  style_negative?: string;
  audio_id?: string;
  persona_id?: string;
  continue_at?: number;
  callback_url: string;
}

export class SunoAPI {
  private static readonly BASE_URL = "https://api.acedata.cloud/suno";
  private static readonly SUNO_API_CALLBACK_URL =
    process.env.SUNO_API_CALLBACK_URL;

  static async uploadReferenceAudio(
    audioUrl: string
  ): Promise<SunoUploadResponse> {
    try {
      const token = process.env.SUNO_API_KEY;
      const response = await fetch(`${this.BASE_URL}/upload`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ audio_url: audioUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
          throw new Error(
            `Suno API error: ${data.error.code} - ${data.error.message}`
          );
        }
        throw new Error(`Suno API error: ${response.statusText}`);
      }

      if (!data.success) {
        throw new Error("Failed to upload audio to Suno");
      }

      return data;
    } catch (error) {
      console.error("Error uploading to Suno:", error);
      throw error;
    }
  }

  static async generateMusic(params: GenerateMusicParams): Promise<string> {
    const token = process.env.SUNO_API_KEY;
    try {
      const response = await fetch(`${this.BASE_URL}/audios`, {
        method: "POST",
        headers: {
          accept: "application/x-ndjson",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `API error: ${response.statusText} - ${JSON.stringify(error)}`
        );
      }

      const data = (await response.json()) as SunoGenerateResponse;
      console.log("Gen Data:", data);

      if (data.success === false) {
        const errorMessage = data.error?.message || "Unknown error occurred";
        throw new Error(`Generation failed: ${errorMessage}`);
      }

      if (!data.task_id) {
        throw new Error("No task_id returned from API");
      }

      return data.task_id;
    } catch (error) {
      console.error("Error generating music:", error);
      throw error;
    }
  }

  static async checkTaskStatus(taskId: string): Promise<SunoTaskResponse> {
    const token = process.env.SUNO_API_KEY;
    try {
      const response = await fetch(`${this.BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: taskId,
          action: "retrieve",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `API error: ${response.statusText} - ${JSON.stringify(error)}`
        );
      }

      const data = (await response.json()) as SunoTaskResponse;

      return data;
    } catch (error) {
      console.error("Error checking task status:", error);
      throw error;
    }
  }

  static async batchCheckTaskStatus(
    taskIds: string[]
  ): Promise<SunoTaskResponse[]> {
    const token = process.env.SUNO_API_KEY;
    try {
      const response = await fetch(`${this.BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ids: taskIds,
          action: "retrieve_batch",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `API error: ${response.statusText} - ${JSON.stringify(error)}`
        );
      }
      const data = (await response.json()) as { items: SunoTaskResponse[] };
      return data.items;
    } catch (error) {
      console.error("Error checking task status:", error);
      throw error;
    }
  }
}
