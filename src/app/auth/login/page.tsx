import Login from "@/components/auth/login";
import { LoginForm } from "@/components/auth/login-form";
import { checkIsAuthenticated } from "@/lib/auth/checkIsAuthenticated";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const isAuthenticated = await checkIsAuthenticated();
  if (isAuthenticated) {
    redirect("/apps/orverview");
  } else {
    return (
      <main className="h-screen">
        <Login />
      </main>
    );
  }
};

export default LoginPage;
