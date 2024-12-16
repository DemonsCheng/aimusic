import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import type { SunoRequest } from '@/types/suno'
export const runtime = 'edge'
import { createTask } from '@/server/service/task';


export async function POST(request: NextRequest) {

    //TODO：检验用户是否登录
    //校验用户是否有足够的积分
    const t_id =  crypto.randomUUID();
    const sunoRequest:SunoRequest = await request.json();
    sunoRequest.action = "generate";
    sunoRequest.model = "chirp-v4";
    sunoRequest.callback_url = `http://openapi.aisongen.com:8090/api/gen-music-callback?t_id=${t_id}`;
    console.log("callback_url", sunoRequest.callback_url);
    console.log("sunoRequest", sunoRequest);
    const options = {
        method: "post",
        headers: {
          "authorization": "Bearer "+ process.env.SUNO_API_KEY,
          "content-type": "application/json"
        },
        body: JSON.stringify(sunoRequest)
      };
      
    const response = await fetch("https://api.acedata.cloud/suno/audios", options);
    
    const data = await response.json() as { task_id?: string };
    let taskId = "";
    if (data?.task_id) {
      taskId = data.task_id;
      console.log("taskId", taskId);
    }

    // 保存任务信息
    const task = {
      userId: "Demons",
      t_id: t_id,
      task_id: taskId,
      model: sunoRequest.model,
      action: sunoRequest.action,
      LLM_Params: JSON.stringify(sunoRequest),
      status: "pending",
    }
    const {rowCount} = await createTask(task);
    if (rowCount === 0) {
      return NextResponse.json({
        success:false,
        message:"create task failed",
      })
    }


    //TODO：扣除用户积分

    return NextResponse.json({
        success:true,
        message:"success",
        data: taskId
    })
}
