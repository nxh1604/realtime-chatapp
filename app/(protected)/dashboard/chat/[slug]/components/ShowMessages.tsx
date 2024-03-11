"use client";
import { dateFormatForMessage } from "@/lib/utils";
import { IMessage } from "@/types/db.type";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

const ShowMessages = ({ messages, userId, senderData }: { senderData: string; userId: string; messages: Array<IMessage & { sending: boolean }> }) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  });

  const [selectedMessage, setSelectedMessage] = useState<null | string>(null);

  const handleSetSelectedMessage = (id: string) => {
    setSelectedMessage((prev) => (id === prev ? null : id));
  };

  return (
    <div ref={divRef} className="flex-1 p-4 flex flex-col-reverse gap-4 overflow-y-auto bg-gradient-to-r from-cyan-400 to-indigo-300">
      {messages.map((message, index) =>
        message.message ? (
          <Message
            selectedMessage={selectedMessage}
            handleSetSelectedMessage={handleSetSelectedMessage}
            key={index}
            id={message.id}
            senderId={message.senderId}
            message={message.message}
            userId={userId}
            sending={message.sending}
            timeStamp={message.timeStamp}
          />
        ) : null
      )}
    </div>
  );
};

export default ShowMessages;

const Message = ({
  senderId,
  userId,
  message,
  sending,
  timeStamp,
  id,
  selectedMessage,
  handleSetSelectedMessage,
}: IMessage & { selectedMessage: string | null; handleSetSelectedMessage: (e: string) => void; userId: string; sending: boolean }) => {
  return (
    <div onClick={() => handleSetSelectedMessage(id)} className="w-full flex flex-col">
      <div
        className={clsx("flex gap-2 items-center", {
          "self-end": senderId === userId,
          "self-start": senderId !== userId,
        })}
      >
        <p
          className={clsx("px-4 py-2 w-fit rounded-lg max-w-[400px]", {
            "bg-indigo-600 text-white": senderId === userId,
            "bg-slate-400 text-black/90": senderId !== userId,
            "brightness-125": selectedMessage === id,
          })}
        >
          {message}
        </p>

        {sending ? <p className="text-center">Sending...</p> : null}
      </div>
      {selectedMessage === id ? (
        <p
          className={clsx("text-sm leading-tight mt-1 relative", {
            "text-end left-2": senderId === userId,
            "text-start -left-2 ": senderId !== userId,
          })}
        >
          {dateFormatForMessage(timeStamp)}
        </p>
      ) : null}
    </div>
  );
};
