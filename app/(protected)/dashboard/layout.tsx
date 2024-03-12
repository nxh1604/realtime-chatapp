import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { getFriendRequestsId, getFriends } from "@/lib/data";
import Sidebar from "./components/Sidebar";
export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    notFound();
  }
  const friendRequestsId = await getFriendRequestsId(session.user.id);
  const friends = await getFriends(session.user.id);
  return (
    <div className="flex">
      <Sidebar userId={session.user.id} friends={friends} friendRequestsId={friendRequestsId} />
      {children}
    </div>
  );
}
