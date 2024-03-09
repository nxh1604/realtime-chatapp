import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import MainNav from "@/components/MainNav";
import SubMainNav from "@/components/SubMainNav";
import UserChatOverviewCard from "@/components/UserChatOverviewCard";
import { getFriends } from "@/lib/data";
export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    notFound();
  }

  return (
    <div className="flex">
      <Sidebar />
      {children}
    </div>
  );
}

const Sidebar = () => {
  return (
    <aside className="h-screen border-r-2 max-w-[300px] w-full min-w-max flex">
      <MainNav />
      <div className="flex-1 max-w-[320px] bg-gradient-to-r from-indigo-500 to-cyan-400 border-l-2">
        <SubMainNav />
        <YourChats />
      </div>
    </aside>
  );
};

const YourChats = async () => {
  const session = await auth();

  if (!session) {
    notFound();
  }

  const friends = await getFriends(session.user.id);

  return (
    <div className="overflow-y-auto">
      <h2 className="px-3">Your chat</h2>
      <nav>
        {friends ? (
          <ul>
            {friends.map((friend) =>
              friend ? (
                <UserChatOverviewCard
                  key={friend.id}
                  id={friend.id}
                  src={friend.image}
                  friendName={friend.email}
                  message={"last message"}
                />
              ) : null
            )}
          </ul>
        ) : (
          <li>No friends</li>
        )}
      </nav>
    </div>
  );
};
