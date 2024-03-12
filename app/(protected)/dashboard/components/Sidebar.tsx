import MainNav from "@/components/MainNav";
import SubMainNav from "@/components/SubMainNav";
import UserChatRoom from "./UserChatRoom";
import { IFriend } from "@/types/db.type";

const Sidebar = ({
  userId,
  friends,
  friendRequestsId,
}: {
  userId: string;
  friends: (IFriend | null)[] | null;
  friendRequestsId: string[] | null;
}) => {
  return (
    <aside className="h-screen border-r-2 max-w-[350px] w-full min-w-max flex">
      <MainNav />
      <div className="flex-1 max-w-[320px] bg-gradient-to-r from-indigo-500 to-cyan-400 border-l-2">
        <SubMainNav userId={userId} friendRequestsId={friendRequestsId} />
        <UserChatRoom userId={userId} friends={friends} />
      </div>
    </aside>
  );
};

export default Sidebar;
