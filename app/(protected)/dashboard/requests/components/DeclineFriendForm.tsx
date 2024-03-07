"use client";
import { declineFriendRequest } from "@/actions/friend";
import { Button } from "@/components/ui/button";
import { ComponentProps, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { FiXCircle } from "react-icons/fi";

const initialState = {
  message: "",
  error: false,
};

const DeclineFriendForm = ({ senderId }: { senderId: string } & ComponentProps<"form">) => {
  const [state, formAction] = useFormState(declineFriendRequest, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.error) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
      }
    }
  });

  return (
    <form action={formAction}>
      <abbr title="Accept friend request">
        <label className="sr-only">Decline Friend request</label>
        <input type="text" name="id" value={senderId} hidden readOnly />
        <DeclineButtonRequest />
        <p aria-live="polite" className="sr-only" role="status">
          {state?.message}
        </p>
      </abbr>
    </form>
  );
};

export default DeclineFriendForm;

const DeclineButtonRequest = () => {
  const { pending } = useFormStatus();
  useEffect(() => {
    let toastId: string | undefined;
    if (pending) {
      toastId = toast.loading("Declining friend request...");
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [pending]);
  return (
    <>
      <Button
        size={"icon"}
        variant={"signout"}
        className="bg-red-600 text-white hover:bg-red-700"
        aria-disabled={pending}
        type="submit">
        <FiXCircle className="w-5 h-5" />
      </Button>
    </>
  );
};
