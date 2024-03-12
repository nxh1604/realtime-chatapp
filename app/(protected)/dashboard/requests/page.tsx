import { auth } from "@/lib/auth";
import { getFriendRequests } from "@/lib/data";
import { notFound } from "next/navigation";
import FriendRequestsList from "./components/FriendRequestsList";

export default async function Page() {
  const session = await auth();
  if (!session) notFound();

  const friendRequestsData = await getFriendRequests(session.user.id);
  return (
    <div>
      <FriendRequestsList userId={session.user.id} friendRequestsData={friendRequestsData} />
    </div>
  );
}

export const dynamic = "force-dynamic";
