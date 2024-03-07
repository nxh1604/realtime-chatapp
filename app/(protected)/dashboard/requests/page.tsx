import { auth } from "@/lib/auth";
import { getFriendRequests } from "@/lib/data";
import { notFound } from "next/navigation";
import FriendRequestItem from "./components/FriendRequestItem";

export default async function Page() {
  const session = await auth();
  if (!session) notFound();

  const friendRequestsData = await getFriendRequests(session.user.id);

  return (
    <div>
      {friendRequestsData.length ? (
        friendRequestsData.map((each, index) => {
          return (
            each && <FriendRequestItem key={index} src={each.senderImage} email={each.senderEmail} id={each.senderId} />
          );
        })
      ) : (
        <p>Currently you have no friend request</p>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
