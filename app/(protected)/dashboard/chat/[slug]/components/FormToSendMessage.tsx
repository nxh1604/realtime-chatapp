"use client";
import { sendMessage } from "@/actions/chat";
import { Button } from "@/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";

const initialState = { message: "", error: false };
const FormToSendMessage = () => {
  const [state, formAction] = useFormState(sendMessage, initialState);
  return (
    <div className="border-t-2 border-t-indigo-700 pb-8">
      <div className="px-3 py-3">Operation to edit text</div>
      <form action={formAction} className="flex gap-6 justify-between px-8 items-center max-w-[1200px] group">
        <InputElement />
      </form>
    </div>
  );
};

const InputElement = () => {
  const { pending } = useFormStatus();
  return (
    <>
      <textarea
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto";
          target.style.height = `${target.scrollHeight}px`;
        }}
        disabled={pending}
        name="message"
        className="flex-1 resize-none max-h-[200px] min-h-[100px] p-3"
        placeholder="Start to chat with each other..."
      />
      <Button disabled={pending} type="submit">
        Send
      </Button>
    </>
  );
};

export default FormToSendMessage;
