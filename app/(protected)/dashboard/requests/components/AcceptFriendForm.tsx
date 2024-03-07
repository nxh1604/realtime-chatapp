"use client";

import { acceptFriendRequest } from "@/actions/friend";
import { Button } from "@/components/ui/button";
import { ComponentProps, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { FiCheckCircle } from "react-icons/fi";

const initialState = {
  message: "",
  error: false,
};

const AcceptFriendForm = ({ senderId }: { senderId: string } & ComponentProps<"form">) => {
  const [state, formAction] = useFormState(acceptFriendRequest, initialState);

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
        <label className="sr-only">Accept Friend request</label>
        <input type="text" name="id" value={senderId} hidden readOnly />
        <AcceptRequestButton />
        <p aria-live="polite" className="sr-only" role="status">
          {state?.message}
        </p>
      </abbr>
    </form>
  );
};

export default AcceptFriendForm;

const AcceptRequestButton = () => {
  const { pending } = useFormStatus();
  useEffect(() => {
    let toastId: string | undefined;
    if (pending) {
      toastId = toast.loading("Accepting friend request...");
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
        className="bg-indigo-600 text-white hover:bg-indigo-700"
        aria-disabled={pending}
        type="submit">
        <FiCheckCircle className="w-5 h-5" />
      </Button>
    </>
  );
};
