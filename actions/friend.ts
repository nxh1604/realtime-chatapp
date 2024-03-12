"use server";
import { auth } from "@/lib/auth";
import redis from "@/lib/db";
import { sortedIds, toPusherKey } from "@/lib/utils";
import { ZodError, z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { pusherSever } from "@/lib/pusher";
import { revalidatePath } from "next/cache";

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

    const isInFriendRequests = await redis.sismember(`user:${userId}:incoming_friends_request`, validatedSenderId.id);

    if (!isInFriendRequests) {
      return { message: "Not in friend requests", error: true };
    }
    const messageForChannelId = uuidv4();
    const removeFriendRequestFromUser = redis.srem(`user:${userId}:incoming_friends_request`, validatedSenderId.id);
    const addFriendForUser = redis.sadd(`user:${userId}:friends`, validatedSenderId.id);
    const removeFriendRequestFromSender = redis.srem(`user:${validatedSenderId.id}:incoming_friends_request`, userId);
    const addFriendForSender = redis.sadd(`user:${validatedSenderId.id}:friends`, userId);
    const createChatChannel = redis.set(`room:${sortedIds(validatedSenderId.id, userId)}`, {
      id: sortedIds(validatedSenderId.id, userId),
      participants: [validatedSenderId.id, userId],
      messageId: messageForChannelId,
    });

    pusherSever.trigger(toPusherKey(`user:${session?.user.id}:request_page_incoming_friends_request`), "request_page_action_friend_request", {
      senderId: validatedSenderId.id,
    });
    pusherSever.trigger(toPusherKey(`user:${session?.user.id}:sidebar_incoming_friends_request`), "sidebar_action_friend_request", {});

    pusherSever.trigger(toPusherKey(`user:${validatedSenderId.id}:friends`), "add_friend", {
      id: session.user.id,
      email: session.user.email,
      image: session.user.image,
    });
    await Promise.all([removeFriendRequestFromUser, addFriendForUser, removeFriendRequestFromSender, addFriendForSender, createChatChannel]);

    revalidatePath("/dashboard/requests");
    return { message: "Friend request accepted", error: false };
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
    // validate the request
    const validatedSenderId = friendSchema.parse({ id: formData.get("id") });

    const isInFriendRequests = await redis.sismember(`user:${userId}:incoming_friends_request`, validatedSenderId.id);

    if (!isInFriendRequests) {
      return { message: "Not in friend requests", error: true };
    }

    pusherSever.trigger(toPusherKey(`user:${session?.user.id}:request_page_incoming_friends_request`), "request_page_action_friend_request", {
      senderId: validatedSenderId.id,
    });
    pusherSever.trigger(toPusherKey(`user:${session?.user.id}:sidebar_incoming_friends_request`), "sidebar_action_friend_request", {});
    await redis.srem(`user:${userId}:incoming_friends_request`, validatedSenderId.id);
    revalidatePath("/dashboard/requests");
    return { message: "Friend request declined", error: false };
  } catch (error) {
    if (error instanceof ZodError) {
      return { message: error.message, error: true };
    }

    return { message: "Somoething went wrong", error: true };
  }
};
