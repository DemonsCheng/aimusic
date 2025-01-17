import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginForm } from "./login-form";

export const description = "Login page.";

export default function Login() {
  return (
    <div className="w-full h-full lg:grid  lg:grid-cols-2 ">
      <div className="flex items-center justify-center py-12">
        <LoginForm />
      </div>
    </div>
  );
}
