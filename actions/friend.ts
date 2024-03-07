"use server";
import { auth } from "@/lib/auth";
import redis from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ZodError, z } from "zod";

const friendSchema = z.object({
  id: z.string(),
});

export const acceptFriendRequest = async (prevState: { message: string }, formData: FormData) => {
  const session = await auth();
  if (!session) return { message: "unauthenticated", error: true };
  const userId = session.user.id;
  console.log({ userId });
  try {
    const validatedSenderId = friendSchema.parse({ id: formData.get("id") });

    const isAlreadyFriends = await redis.sismember(`user:${userId}:friends`, validatedSenderId.id);

    if (isAlreadyFriends) {
      return { message: "Already friends", error: true };
    }

    const isInFriendRequests = await redis.sismember(`user:${userId}:incoming_friend_requests`, validatedSenderId.id);

    if (!isInFriendRequests) {
      return { message: "Not in friend requests", error: true };
    }

    const all1 = redis.srem(`user:${userId}:incoming_friend_requests`, validatedSenderId.id);
    const all2 = redis.sadd(`user:${userId}:friends`, validatedSenderId.id);
    const all3 = redis.srem(`user:${validatedSenderId.id}:incoming_friend_requests`, userId);
    const all4 = redis.sadd(`user:${validatedSenderId.id}:friends`, userId);

    await Promise.all([all1, all2, all3, all4]);
    revalidatePath(`/dashboard/requests`);
    return { message: "Friend request accepted", error: false };

    // validate the request
  } catch (error) {
    if (error instanceof ZodError) {
      return { message: error.message, error: true };
    }

    return { message: "Somoething went wrong", error: true };
  }
};

export const declineFriendRequest = async (prevState: { message: string }, formData: FormData) => {
  const session = await auth();
  if (!session) return { message: "unauthenticated", error: true };
  const userId = session.user.id;

  try {
    const validatedSenderId = friendSchema.parse({ id: formData.get("id") });

    const isInFriendRequests = await redis.sismember(`user:${userId}:incoming_friend_requests`, validatedSenderId.id);

    if (!isInFriendRequests) {
      return { message: "Not in friend requests", error: true };
    }

    await redis.srem(`user:${userId}:incoming_friend_requests`, validatedSenderId.id);

    revalidatePath(`/dashboard/requests`);
    return { message: "Friend request declined", error: false };

    // validate the request
  } catch (error) {
    if (error instanceof ZodError) {
      return { message: error.message, error: true };
    }

    return { message: "Somoething went wrong", error: true };
  }
};
