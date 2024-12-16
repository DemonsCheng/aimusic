"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/lib/auth/authConfig";

export const handleEmailLogin = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  console.log(values);
  const { email } = validatedFields.data;

  try {
    await signIn("resend", {
      email,
      redirect: false,
      callbackUrl: "/dashboard",
    });
    return { success: "Email Send!" };
  } catch (error) {
    throw error;
  }
};
