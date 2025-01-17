"use server";

import { auth } from "@/lib/auth/authConfig";

export async function getServerSession() {
  const session = await auth();
  return session;
}
