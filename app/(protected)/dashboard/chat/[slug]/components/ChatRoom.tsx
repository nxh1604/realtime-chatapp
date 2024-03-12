"use client";

import { useEffect, useOptimistic, useState } from "react";
import FormToSendMessage from "./FormToSendMessage";
import { IMessage } from "@/types/db.type";
import ShowMessages from "./ShowMessages";
import { pusherClient } from "@/lib/pusher";
import { sortedIds, toPusherKey } from "@/lib/utils";
import { useRouter } from "next/navigation";

const ChatRoom = ({
  initialMessages,
  friendId,
  friendImage,
  userId,
}: {
  initialMessages: Array<IMessage & { sending: boolean }>;
  userId: string;
  friendId: string;
  friendImage: string;
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const { refresh } = useRouter();
  const [optimisticMessages, addOptimisticMessages] = useOptimistic(messages, (state: Array<IMessage & { sending: boolean }>, newMessage: string) => [
    {
      id: "1",
      message: newMessage,
      sending: true,
      senderId: userId,
      timeStamp: Date.now(),
    },
    ...state,
  ]);
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`room:${sortedIds(friendId, userId)}`));
    pusherClient.unsubscribe(toPusherKey(`sidebar_room:${sortedIds(userId, friendId)}`));

    const handleSendMessage = (message: IMessage & { sending: boolean }) => {
      setMessages((prev) => [message, ...prev]);
    };

    pusherClient.bind("send_message", handleSendMessage);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`room:${sortedIds(friendId, userId)}`));
      pusherClient.unbind("send_message", handleSendMessage);
      refresh();
    };
  }, [friendId, userId, refresh]);

  return (
    <>
      <ShowMessages messages={optimisticMessages} userId={userId} senderImage={friendImage} />
      <FormToSendMessage addOptimisticMessages={addOptimisticMessages} friendId={friendId} userId={userId} />
    </>
  );
};

export default ChatRoom;
