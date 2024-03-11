"use client";

import { useOptimistic, useState } from "react";
import FormToSendMessage from "./FormToSendMessage";
import { IMessage } from "@/types/db.type";
import ShowMessages from "./ShowMessages";

const ChatRoom = ({
  initialMessages,
  friendId,
  userId,
}: {
  initialMessages: Array<IMessage & { sending: boolean }>;
  userId: string;
  friendId: string;
}) => {
  const [optimisticMessages, addOptimisticMessages] = useOptimistic(
    initialMessages,
    (state: Array<IMessage & { sending: boolean }>, newMessage: string) => [
      {
        id: "1",
        message: newMessage,
        sending: true,
        senderId: userId,
        timeStamp: Date.now(),
      },
      ...state,
    ]
  );

  return (
    <>
      <ShowMessages messages={optimisticMessages} userId={userId} senderData={friendId} />
      <FormToSendMessage addOptimisticMessages={addOptimisticMessages} friendId={friendId} userId={userId} />
    </>
  );
};

export default ChatRoom;
