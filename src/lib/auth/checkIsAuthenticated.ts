"use server";
import { auth } from "@/lib/auth/authConfig";

export async function checkIsAuthenticated() {
  try {
    const session = await auth();
    return !!session?.user;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
}
