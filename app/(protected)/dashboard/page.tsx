import { auth } from "@/lib/auth";
import { getFriendRequestsId } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session) return notFound();
  const requests = await getFriendRequestsId(session.user.id);

  if (!requests) return <main>Empty friend request...</main>;

  return (
    <main>
      {requests?.map((request) => (
        <div key={request}>{request}</div>
      ))}
    </main>
  );
}
