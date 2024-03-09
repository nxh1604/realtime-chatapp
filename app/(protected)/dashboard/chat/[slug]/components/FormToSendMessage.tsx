"use client";
import { sendMessage } from "@/actions/chat";
import { Button } from "@/components/ui/button";
import { sortedIds } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

const initialState = { message: "", error: false };
const FormToSendMessage = ({ sessionId, friendId }: { friendId: string; sessionId: string }) => {
  const [_, formAction] = useFormState(sendMessage, initialState);
  console.log(sortedIds(sessionId, friendId));
  return (
    <div className="border-t-2 border-t-indigo-700 pb-8">
      <div className="px-3 py-3">Operation to edit text</div>
      <form action={formAction} className="flex gap-6 justify-between px-8 items-center max-w-[1200px] mx-auto group">
        <InputElement friendId={friendId} sessionId={sessionId} />
      </form>
    </div>
  );
};

const InputElement = ({ sessionId, friendId }: { friendId: string; sessionId: string }) => {
  const [message, setMessage] = useState("");
  const { pending, data } = useFormStatus();

  useEffect(() => {
    if (data) {
      setMessage("");
    }
  }, [data]);

  return (
    <>
      <textarea
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto";
          target.style.height = `${target.scrollHeight}px`;
        }}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={500}
        disabled={pending}
        value={message}
        name="message"
        className="flex-1 resize-none max-h-[200px] min-h-[100px] p-3"
        placeholder="Start to chat with each other..."
      />
      <input readOnly name="userId" hidden value={sessionId} />
      <input readOnly name="friendId" hidden value={friendId} />
      <Button disabled={pending || !message} type="submit">
        Send
      </Button>
    </>
  );
};

export default FormToSendMessage;
