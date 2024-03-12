"use client";
import UserChatOverviewCard from "@/components/UserChatOverviewCard";
import { pusherClient } from "@/lib/pusher";
import { sortedIds, toPusherKey } from "@/lib/utils";
import { IFriend } from "@/types/db.type";
import { useEffect, useState } from "react";

const UserChatRoom = ({ userId, friends }: { userId: string; friends: (IFriend | null)[] | null }) => {
  const [realtimeFriends, setRealtimeFriends] = useState(friends);

  useEffect(() => {
    setRealtimeFriends(friends);
    pusherClient.subscribe(toPusherKey(`user:${userId}:friends`));
    const handleAddFriends = (data: IFriend) => {
      setRealtimeFriends((prev) => {
        return !prev ? [data] : [...prev, data];
      });
    };

    pusherClient.bind("add_friend", handleAddFriends);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${userId}:friends`));
      pusherClient.unbind("add_friend", handleAddFriends);
    };
  }, [userId, friends]);

  return (
    <div className="">
      <h2 className="px-3">Your chat</h2>
      <nav className="px-2">
        {realtimeFriends ? (
          <ul>
            {realtimeFriends.map((friend) =>
              friend ? (
                <UserChatOverviewCard
                  key={friend.id}
                  userId={userId}
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

export default UserChatRoom;
