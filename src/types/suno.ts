
  export interface SunoRequest {
    action: string;
    prompt?: string;
    model: string,
    lyric?:string;
    custom:boolean;
    instrumental: boolean;
    title?: string;
    style?: string;
    audio_id?:string;
    continue_at?: number;
    callback_url:string;
  }



export interface SunoItemResponse{
    id:string;
    lyric:string;
    model:string;
    style:string;
    title:string;
    prompt:string;
    audio_url:string;
    image_url:string;
    video_url:string;
    create_at:string;
}


export interface SunoCallbackResponse{
    success:boolean;
    task_id:string;
    error:string;
    track_id:string;
}
