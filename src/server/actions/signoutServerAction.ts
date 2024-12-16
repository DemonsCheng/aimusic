"use server";

import { signOut } from "@/server/auth/authConfig";

export const handleSignOut = async () => {
  try {
    await signOut();
  } catch (error) {
    throw error;
  }
};