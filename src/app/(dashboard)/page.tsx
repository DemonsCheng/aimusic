import { redirect } from "next/navigation";
import { checkIsAuthenticated } from "@/lib/auth/checkIsAuthenticated";

const Dashboard = async () => {
  const isAuthenticated = await checkIsAuthenticated();

  if (!isAuthenticated) {
    // redirect("/auth/login");
    redirect("/apps/overview");
  } else {
    redirect("/apps/overview");
  }
};

export default Dashboard;
