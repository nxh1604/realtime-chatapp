import { ComponentProps } from "react";
import Avatar from "./Avatar";
import Link from "next/link";

const UserChatOverviewCard = ({
  id,
  src,
  friendName,
  message,
}: { id: string; friendName: string; message: string; src: string } & ComponentProps<"li">) => {
  return (
    <li>
      <Link
        href={`/dashboard/chat/${id}`}
        className="flex gap-2 items-center cursor-pointer hover:bg-indigo-100 px-3 py-1">
        <Avatar src={src} />
        <div>
          <p className="line-clamp-1 font-medium truncate">{friendName}</p>
          <p className="line-clamp-1 text-sm text-gray-400 truncate">{message}</p>
        </div>
      </Link>
    </li>
  );
};

export default UserChatOverviewCard;
