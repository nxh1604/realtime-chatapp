"use server";
import { auth } from "@/lib/auth";
import redis from "@/lib/db";
import { sortedIds } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { ZodError, z } from "zod";
import { v4 as uuidv4 } from "uuid";

const friendSchema = z.object({
  id: z.string(),
});

export const acceptFriendRequest = async (prevState: { message: string }, formData: FormData) => {
  const session = await auth();
  if (!session) return { message: "unauthenticated", error: true };
  const userId = session.user.id;

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
    const messageForChannelId = uuidv4();
    const removeFriendRequestFromUser = redis.srem(`user:${userId}:incoming_friend_requests`, validatedSenderId.id);
    const addFriendForUser = redis.sadd(`user:${userId}:friends`, validatedSenderId.id);
    const removeFriendRequestFromSender = redis.srem(`user:${validatedSenderId.id}:incoming_friend_requests`, userId);
    const addFriendForSender = redis.sadd(`user:${validatedSenderId.id}:friends`, userId);
    const createChatChannel = redis.set(`room:${sortedIds(validatedSenderId.id, userId)}`, {
      id: sortedIds(validatedSenderId.id, userId),
      participants: [validatedSenderId.id, userId],
      messageId: messageForChannelId,
    });

    await Promise.all([removeFriendRequestFromUser, addFriendForUser, removeFriendRequestFromSender, addFriendForSender, createChatChannel]);
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
