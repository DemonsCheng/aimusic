"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import Image from "next/image";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] px-0 pt-8 pb-0 overflow-hidden bg-background">
        <DialogTitle className="text-center px-8">
          Welcome to AI Music
        </DialogTitle>

        {/* Logo and Title Section */}
        <div className="flex flex-col items-center space-y-3 mb-8 px-8">
          <div className="rounded-full bg-primary/10 p-3">
            <Image
              src="/logo.webp"
              alt="AI Music"
              width={40}
              height={40}
              className="h-10 w-10"
            />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              Login to your account to continue
            </p>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="px-8">
          <LoginForm />
        </div>

        {/* Footer Text */}
        <div className="mt-8 px-8 pb-8 text-center">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
