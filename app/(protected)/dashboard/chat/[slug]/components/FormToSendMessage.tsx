"use client";
import { sendMessage } from "@/actions/chat";
import { Button } from "@/components/ui/button";
import { sortedIds } from "@/lib/utils";
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

const FormToSendMessage = ({
  userId,
  friendId,
  addOptimisticMessages,
}: {
  addOptimisticMessages: (message: string) => void;
  friendId: string;
  userId: string;
}) => {
  // handle submit here!
  const formAction = async (formData: FormData) => {
    addOptimisticMessages(formData.get("message") as string);
    // await new Promise((resovle) =>
    //   setTimeout(() => {
    //     resovle("nothing");
    //   }, 3000)
    // );
    const state = await sendMessage(formData);
    if (state.error) {
      toast.error(state.message);
    }
  };

  return (
    <div className="border-t-2  pb-8 bg-gradient-to-r from-cyan-400 to-indigo-300">
      <div className="px-3 py-3">Operation to edit text</div>
      <form action={formAction} className="flex gap-6 justify-between px-8 items-center max-w-[1200px] mx-auto group">
        <InputForm userId={userId} friendId={friendId} />
      </form>
    </div>
  );
};

export default FormToSendMessage;

const InputForm = ({ userId, friendId }: { userId: string; friendId: string }) => {
  const { pending } = useFormStatus();
  const [message, setMessage] = useState("");

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // handle Text area here!
  const handleTextAreaMessage = (e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value);

  // ngan textarea enter va submit form
  const handleTextAreaEnterKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      buttonRef.current?.click();
    }
  };

  // auto focus texarea moi lan submit form
  useEffect(() => {
    console.log("useEffect");
    if (!pending) {
      textAreaRef.current?.focus();
    }
  }, [pending]);

  // chinh textarea height
  const handleTextAreaHeight = (e: FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };
  return (
    <>
      <textarea
        ref={textAreaRef}
        onInput={handleTextAreaHeight}
        onChange={handleTextAreaMessage}
        maxLength={500}
        value={message}
        onKeyDown={handleTextAreaEnterKey}
        name="message"
        className="flex-1 resize-none max-h-[100px] min-h-[80px] p-3 bg-slate-700 text-white outline-none border-indigo-400 rounded-lg focus:border-2"
        placeholder="Start to chat with each other..."
      />
      <input readOnly name="userId" hidden value={userId} />
      <input readOnly name="friendId" hidden value={friendId} />
      <Button
        onClick={() => {
          setMessage("");
          buttonRef.current?.click();
        }}
        ref={buttonRef}
        disabled={!message}
        type="submit"
      >
        Send
      </Button>
    </>
  );
};
