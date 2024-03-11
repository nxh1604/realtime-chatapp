"use client";

import { useOptimistic, useState } from "react";
import FormToSendMessage from "./FormToSendMessage";
import ShowMessage from "./ShowMessage";

const ChatRoom = ({
  initialMessages,
  friendId,
  userId,
}: {
  initialMessages: Array<{ text: string; senderId: string }>;
  userId: string;
  friendId: string;
}) => {
  const modifiedInitialMessages = initialMessages.map((message) => {
    return {
      ...message,
      sending: false,
    };
  });
  const [optimisticMessages, addOptimisticMessages] = useOptimistic(
    modifiedInitialMessages,
    (state: Array<{ text: string; sending: boolean; senderId: string }>, newMessage: string) => [
      ...state,
      {
        text: newMessage,
        sending: true,
        senderId: userId,
      },
    ]
  );

  return (
    <>
      <ShowMessage messages={optimisticMessages} userId={userId} friendId={friendId} />
      <FormToSendMessage addOptimisticMessages={addOptimisticMessages} friendId={friendId} userId={userId} />
    </>
  );
};

export default ChatRoom;
