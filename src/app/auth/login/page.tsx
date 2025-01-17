import Login from "@/components/auth/login";
import { checkIsAuthenticated } from "@/lib/auth/checkIsAuthenticated";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const isAuthenticated = await checkIsAuthenticated();
  if (isAuthenticated) {
    redirect("/ai-song-generator");
  } else {
    return (
      <main className="h-screen">
        <Login />
      </main>
    );
  }
};

export const dynamic = "force-dynamic";

export default LoginPage;
