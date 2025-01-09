import { NextRequest, NextResponse } from "next/server";
import { SunoCallbackResponse } from "@/types/suno";
import { updateTask } from "@/server/service/task";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ t_id: string }> }
) {
  const { t_id } = await params;
  const callbackResponse = (await request.json()) as SunoCallbackResponse;

  console.log(callbackResponse);
  if (!callbackResponse.success) {
    // 更新任务状态为失败
    const { rowCount } = await updateTask({
      t_id: t_id,
      status: "failed",
      result: JSON.stringify(callbackResponse.error),
      task_id: callbackResponse.task_id,
      track_id: callbackResponse.track_id,
      updatedAt: new Date().toISOString(),
      userId: "Demons",
      model: "chirp-v4",
      action: "generate",
      LLM_Params: JSON.stringify({}),
    });

    return NextResponse.json({
      success: false,
    });
  }

  //TODO：根据回调的返回，修改任务状态。保存音乐信息。
  // 若失败，检查积分表中，做检验后， 则增加用户积分。

  return NextResponse.json({
    success: true,
    message: "success",
  });
}
