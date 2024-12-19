import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/authConfig";
import { SelectMusic } from "@/server/service/music";

export async function GET(req: NextRequest) {


    // const session = await auth();
    // console.log("session", session);
    // const userId = session?.user?.id 
    // if (!userId) {
    //     return Response.json({
    //         code: -1,
    //         error: "Not signed in",
    //     });
    // }
    // console.log("userId", userId);

    const userId = "Demons";
    const musicList = await SelectMusic(userId)
    return Response.json({
        data: musicList,
        success: true,
        code: 1,
    })

}
