"use client";
import { ComponentProps, useEffect, useState } from "react";
import Avatar from "./Avatar";
import Link from "next/link";
import { pusherClient } from "@/lib/pusher";
import { sortedIds, toPusherKey } from "@/lib/utils";
import { usePathname } from "next/navigation";

const UserChatOverviewCard = ({
  id,
  src,
  userId,
  friendName,
  message,
}: { userId: string; id: string; friendName: string; message: string; src: string } & ComponentProps<"li">) => {
  const pathName = usePathname();
  const [unReadMessage, setUnReadMessage] = useState(0);
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`sidebar_room:${sortedIds(userId, id)}`));

    const handleAddUnReadMessage = () => {
      console.log("listen in ", sortedIds(userId, id));
      setUnReadMessage((prev) => ++prev);
    };

    pusherClient.bind(`add_unReadMessage_${sortedIds(userId, id)}`, handleAddUnReadMessage);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`sidebar_room:${sortedIds(userId, id)}`));
      pusherClient.unbind(`add_unReadMessage_${sortedIds(userId, id)}`, handleAddUnReadMessage);
    };
  }, [userId, id]);

  return (
    <li>
      <Link
        onClick={() => {
          setUnReadMessage(0);
          pusherClient.unsubscribe(toPusherKey(`sidebar_room:${sortedIds(userId, id)}`));
        }}
        prefetch
        href={`/dashboard/chat/${id}`}
        className="flex items-center justify-between gap-2 cursor-pointer hover:bg-indigo-600 px-3 py-1"
      >
        <div className="flex gap-2 items-center ">
          <Avatar src={src} />
          <div>
            <p className="line-clamp-1 font-medium truncate">{friendName}</p>
            <p className="line-clamp-1 text-sm text-white truncate">{message}</p>
          </div>
        </div>
        {unReadMessage && pathName.split("/").at(-1) !== id ? (
          <div className="text-xs rounded-full w-[25px] h-[25px] inline-flex items-center justify-center bg-green-600 text-white">
            {unReadMessage}
          </div>
        ) : null}
      </Link>
    </li>
  );
};

export default UserChatOverviewCard;
