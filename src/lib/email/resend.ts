import { Resend } from 'resend';


let resend: Resend | null;

const getResend = () => {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
};

export default getResend;