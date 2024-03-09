"use client";
import { Button } from "@/components/ui/button";
import { AddFriendDataType, addFriendValidator } from "@/lib/validators/add-friend";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import toast from "react-hot-toast";
import { LuLoader } from "react-icons/lu";
import { useState } from "react";

const AddFriendForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    setError,
    reset,
    formState: { errors, isLoading: formIsLoading },
    handleSubmit,
  } = useForm<AddFriendDataType>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    setIsLoading(true);
    try {
      const validatedEmail = addFriendValidator.parse({ email });

      const res = await fetch("/api/friends/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: validatedEmail }),
      });

      if (!res.ok) {
        const error = await res.json();
        switch (res.status) {
          case 404:
            throw new Error(error.message);
          case 401:
            throw new Error(error.message);
          case 400:
            throw new Error(error.message);
          default:
            throw new Error(error.message);
        }
      }
      toast.success("Friend request sent!");
      reset();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
      }
      if (error instanceof Error) {
        setError("email", { message: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: AddFriendDataType) => {
    await addFriend(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="ml-4">
      <label htmlFor="email">Add friend by E-mail</label>
      <div className="space-x-1">
        <input
          id="email"
          aria-label="input-email"
          className="disabled:bg-slate-400 bg-[#F7FBFF] mt-[2px] py-2 px-4 outline-indigo-500 outline-2 rounded-lg border-[1px] border-[#D4D7E3]"
          placeholder="you@example.com"
          disabled={isLoading}
          type="email"
          required
          autoComplete="off"
          {...register("email")}
        />
        <Button type="submit" className="gap-2" disabled={isLoading}>
          Add friend {isLoading && <LuLoader className="animate-spin" />}
        </Button>
      </div>
      {errors.email && (
        <p role="alert" className="text-red-500">
          {errors.email.message}
        </p>
      )}
    </form>
  );
};

export default AddFriendForm;
