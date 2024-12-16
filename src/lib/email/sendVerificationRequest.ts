import { EmailTemplate } from "@/components/email-template";
import getResend from "@/lib/email/resend";

interface VerificationRequestParams {
  identifier: string;
  provider: {
    from: string;
  };
  url: string;
}

export async function sendVerificationRequest(
  params: VerificationRequestParams
) {
  const resend = getResend();

  const { url } = params;

  console.log("magicLink:  ", url);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM as string,
      to: params.identifier,
      subject: "Hello World",
      react: EmailTemplate({ magicLink: url }),
    });

    if (error) {
      console.log("Send Email Error :   ", error);
      return Response.json({ error }, { status: 500 });
    }
    console.log("Send Email data :   ", data);
    return Response.json(data);
  } catch (error) {
    console.log("Send Email Error :   ", error);
    return Response.json({ error }, { status: 500 });
  }
}
