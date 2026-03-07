import { redirect } from "next/navigation";
import { getSessionUserId } from "@/services/auth/server";

export default async function Home() {
  const userId = await getSessionUserId();

  if (userId) redirect("/user/profile");
  else redirect("/auth/login");
}
