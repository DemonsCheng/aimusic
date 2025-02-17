import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

export class R2Storage {
  private static readonly client = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
  });

  private static readonly BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

  /**
   * 上传音频文件到 R2 存储
   * @param file 音频文件
   * @returns 公开访问的 URL
   */
  static async uploadAudio(file: File): Promise<string> {
    try {
      // 验证文件
      // Check if file type exists and is audio
      // Get file extension from name
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const audioExtensions = ["mp3", "wav", "ogg", "m4a", "aac", "flac"];

      // Check file type from both MIME type and extension
      const isAudioMime = file.type?.startsWith("audio/");
      const isAudioExt = audioExtensions.includes(fileExt || "");

      if (!isAudioMime && !isAudioExt) {
        throw new Error("Invalid file type - must be an audio file");
      }

      if (!this.validateFileSize(file, 10)) {
        throw new Error("File too large (max 10MB)");
      }

      // 生成唯一文件名
      // const fileExt = file.name.split(".").pop();
      const fileName = `music/${nanoid()}.${fileExt}`;

      // 上传文件
      const putCommand = new PutObjectCommand({
        Bucket: this.BUCKET_NAME,
        Key: fileName,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
      });

      await this.client.send(putCommand);

      // 生成公开访问URL
      const getCommand = new GetObjectCommand({
        Bucket: this.BUCKET_NAME,
        Key: fileName,
      });

      const url = await getSignedUrl(this.client, getCommand, {
        expiresIn: 60 * 60 * 24, // 一天过期
      });

      return url;
    } catch (error) {
      console.error("Error uploading to R2:", error);
      throw error;
    }
  }

  /**
   * 验证文件大小
   * @param file 文件
   * @param maxSizeMB 最大大小（MB）
   * @returns boolean
   */
  private static validateFileSize(file: File, maxSizeMB: number): boolean {
    const maxSize = maxSizeMB * 1024 * 1024;
    return file.size <= maxSize;
  }

  /**
   * 删除文件
   * @param fileUrl 文件URL
   */
  static async deleteFile(fileUrl: string): Promise<void> {
    try {
      const url = new URL(fileUrl);
      const key = url.pathname.substring(1); // 移除开头的 '/'

      const deleteCommand = new PutObjectCommand({
        Bucket: this.BUCKET_NAME,
        Key: key,
      });

      await this.client.send(deleteCommand);
    } catch (error) {
      console.error("Error deleting from R2:", error);
      throw error;
    }
  }
}
