"use client";
import { IFriendRequestData } from "@/types/db.type";
import FriendRequestItem from "./FriendRequestItem";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { useRouter } from "next/navigation";

const FriendRequestsList = ({ friendRequestsData, userId }: { userId: string; friendRequestsData: (IFriendRequestData | null)[] }) => {
  const [friendRequests, setFriendRequests] = useState(friendRequestsData);
  const { refresh } = useRouter();
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${userId}:request_page_incoming_friends_request`));
    const handleIncomingFriendRequest = (incomingFriendRequest: IFriendRequestData) => {
      setFriendRequests((prev) => [...prev, incomingFriendRequest]);
      refresh();
    };

    const handleActionFriendRequest = (requestId: { senderId: string }) => {
      setFriendRequests((prev) => prev.filter((item) => item?.senderId !== requestId.senderId));
    };
    pusherClient.bind("request_page_incoming_friends_request", handleIncomingFriendRequest);

    pusherClient.bind("request_page_action_friend_request", handleActionFriendRequest);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${userId}:request_page_incoming_friends_request`));
      pusherClient.unbind("request_page_incoming_friends_request", handleIncomingFriendRequest);
      pusherClient.unbind("request_page_action_friend_request", handleActionFriendRequest);
    };
  }, [userId, refresh]);

  return (
    <div>
      {friendRequests.length > 0 ? (
        friendRequests.map((each, index) => {
          return each && <FriendRequestItem key={index} src={each.senderImage} email={each.senderEmail} id={each.senderId} />;
        })
      ) : (
        <p>Currently you have no friend request</p>
      )}
    </div>
  );
};

export default FriendRequestsList;
