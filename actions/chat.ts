"use server";

import redis from "@/lib/db";
import { sortedIds } from "@/lib/utils";
import sendMessageSchema from "@/lib/validators/send-message";
import { IChatRoom } from "@/types/db.type";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { ZodError } from "zod";

export const sendMessage = async (formData: FormData) => {
  try {
    const { message, userId, friendId } = sendMessageSchema.parse({
      message: formData.get("message"),
      userId: formData.get("userId"),
      friendId: formData.get("friendId"),
    });
    // tao chat message
    const roomId = sortedIds(userId, friendId);
    const roomData = (await redis.get(`room:${roomId}`)) as IChatRoom;
    const messageId = roomData.messageId;
    const messageToDb = {
      id: uuidv4(),
      senderId: userId,
      message: message,
      timeStamp: Date.now(),
    };
    await redis.zadd(`room:message:${messageId}`, { score: messageToDb.timeStamp, member: messageToDb.id });
    await redis.set(`message:${messageToDb.id}`, messageToDb);
    revalidatePath(`/dashboard/chat/${userId}`);
    return { message: "successfullt send message", error: false };
  } catch (error) {
    console.log("error from send Message");
    if (error instanceof ZodError) {
      return { message: error.message, error: true };
    }

    return { message: "Can't send message to the server", error: true };
  }
};
