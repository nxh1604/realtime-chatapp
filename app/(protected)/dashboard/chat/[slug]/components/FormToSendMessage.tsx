"use client";
import { sendMessage } from "@/actions/chat";
import { Button } from "@/components/ui/button";
import { sortedIds } from "@/lib/utils";
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

const FormToSendMessage = ({
  userId,
  friendId,
  addOptimisticMessages,
}: {
  addOptimisticMessages: (message: string) => void;
  friendId: string;
  userId: string;
}) => {
  const [message, setMessage] = useState("");

  const handleTextAreaMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  const formAction = async (formData: FormData) => {
    setMessage("");
    addOptimisticMessages(formData.get("message") as string);
    // await sendMessage(formData);
    await new Promise((resolve) => setTimeout(() => resolve(null), 2000));
  };
  return (
    <div className="border-t-2  pb-8 bg-gradient-to-r from-cyan-400 to-indigo-300">
      <div className="px-3 py-3">Operation to edit text</div>
      <form action={formAction} className="flex gap-6 justify-between px-8 items-center max-w-[1200px] mx-auto group">
        <InputMessageForm
          userId={userId}
          friendId={friendId}
          message={message}
          handleTextAreaMessage={handleTextAreaMessage}
        />
      </form>
    </div>
  );
};

export default FormToSendMessage;

const InputMessageForm = ({
  userId,
  friendId,
  message,
  handleTextAreaMessage,
}: {
  userId: string;
  friendId: string;
  message: string;
  handleTextAreaMessage: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  const { pending } = useFormStatus();

  // auto focus texarea moi lan submit form
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  // ngan textarea enter va submit form
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleTextAreaEnterKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      buttonRef.current?.click();
    }
  };

  const handleTextAreaHeight = (e: FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };

  useEffect(() => {
    console.log("useEffect");
    if (!pending) {
      textAreaRef.current?.focus();
    }
  }, [pending]);

  return (
    <>
      <textarea
        ref={textAreaRef}
        onInput={handleTextAreaHeight}
        onChange={handleTextAreaMessage}
        maxLength={500}
        disabled={pending}
        value={message}
        onKeyDown={handleTextAreaEnterKey}
        name="message"
        className="flex-1 resize-none max-h-[100px] min-h-[80px] p-3 bg-slate-700 text-white outline-none border-indigo-400 rounded-lg focus:border-2"
        placeholder="Start to chat with each other..."
      />
      <input readOnly name="userId" hidden value={userId} />
      <input readOnly name="friendId" hidden value={friendId} />
      <Button ref={buttonRef} disabled={pending || !message} type="submit">
        Send
      </Button>
    </>
  );
};
