"use client";
import { IFriendRequestData } from "@/types/db";
import FriendRequestItem from "./FriendRequestItem";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

const FriendRequestsList = ({
  friendRequestsData,
  userId,
}: {
  userId: string;
  friendRequestsData: (IFriendRequestData | null)[];
}) => {
  const [friendRequests, setFriendRequests] = useState(friendRequestsData);

  useEffect(() => {
    console.log("friendRequestsData", friendRequestsData);
    setFriendRequests(friendRequestsData);
    pusherClient.subscribe(toPusherKey(`user:${userId}:incoming_friend_requests`));
    pusherClient.bind("incoming_friend_requests", (incomingFriendRequest: IFriendRequestData) => {
      console.log("incomingFriendRequest", incomingFriendRequest);
      setFriendRequests((prev) => [...prev, incomingFriendRequest]);
    });

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${userId}:incoming_friend_requests`));
      pusherClient.unbind("incoming_friend_requests");
    };
  }, [friendRequestsData, userId]);

  return (
    <div>
      {friendRequests.length > 0 ? (
        friendRequests.map((each, index) => {
          return (
            each && <FriendRequestItem key={index} src={each.senderImage} email={each.senderEmail} id={each.senderId} />
          );
        })
      ) : (
        <p>Currently you have no friend request</p>
      )}
    </div>
  );
};

export default FriendRequestsList;
