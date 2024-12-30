"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { handleGoogleSignIn } from "@/server/actions/googleLoginServerAction";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || "/dashboard",
      // callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex items-center w-full gap-x-2 co">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => handleGoogleSignIn()}
      >
        <FcGoogle className="h-5 w-5" />
        Sign in with Google
      </Button>
    </div>
  );
};
