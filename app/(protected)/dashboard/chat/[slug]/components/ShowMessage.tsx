"use client";
import clsx from "clsx";
import { useEffect, useRef } from "react";

const ShowMessage = ({
  messages,
  userId,
  friendId,
}: {
  friendId: string;
  userId: string;
  messages: Array<{ text: string; sending: boolean; senderId: string }>;
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  });

  return (
    <div
      ref={divRef}
      className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto bg-gradient-to-r from-cyan-400 to-indigo-300">
      {messages.map((message, index) => (
        <div
          key={index}
          className={clsx("flex gap-2 items-center", {
            "self-end": message.senderId === userId,
            "self-start": message.senderId === friendId,
          })}>
          <p
            className={clsx("px-4 py-2 w-fit rounded-lg max-w-[400px]", {
              "bg-indigo-600 text-white": message.senderId === userId,
              "bg-slate-400 text-black/90": message.senderId === friendId,
            })}>
            {message.text}
          </p>
          {message.sending ? <p className="text-center">Sending...</p> : null}
        </div>
      ))}
    </div>
  );
};

export default ShowMessage;
