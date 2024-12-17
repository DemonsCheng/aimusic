"use server";

import { z } from "zod"
import {InstrumentalFormSchema, NormalFormSchema}  from "@/schemas";
import { SunoRequest } from "@/types/suno";
import { createTask } from '@/server/service/task';
import { checkIsAuthenticated } from "@/lib/auth/checkIsAuthenticated";
import { parseServerActionResponse } from "@/lib/utils";

//   // 2. Define a submit handler.
//   export async  function onSubmitNormalForm(values: z.infer<typeof NormalFormSchema>) {
//     // Do something with the form values.
//     // ✅ This will be type-safe and validated.
//     console.log(values);
//   }

  export async function handleInstrumentalForm(
    // values: z.infer<typeof InstrumentalFormSchema>
    values: z.infer<typeof InstrumentalFormSchema>
  ) {



    const isAuthenticated = await checkIsAuthenticated();

    if (!isAuthenticated)
      return parseServerActionResponse({
        error: "Not signed in",
        status: "ERROR",
      });

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("Action:", values);
    const {description} = values;
    const t_id =  crypto.randomUUID();
    // const callback_url = `http://openapi.aisongen.com:8090/api/gen-music-callback?t_id=${t_id}`;
    const sunoRequest: SunoRequest = {
      prompt: description,
      action: "generate",
      model: "chirp-v4",
      // callback_url: callback_url,
      custom: false,
      instrumental: true
    };

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
      console.log("data", data);
    }

    // 保存任务信息
    // 上传music到R2
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
      return  parseServerActionResponse({
        success:false,
        message:"create music failed",
      });
    }

    return parseServerActionResponse({
      data: taskId,
      error: "",
      status: "SUCCESS",
    });
     //TODO：扣除用户积分
    
  }





  
