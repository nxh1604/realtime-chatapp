import { auth } from "@/lib/auth";
import redis from "@/lib/db";
import { pusherSever } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validators/add-friend";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const { email } = await req.json();
    const validatedEmail = addFriendValidator.parse(email);

    // check authourized
    const authData = await auth();

    if (!authData) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    // check added user existen?
    const getUserIdToAdd = await redis.get(`user:email:${validatedEmail.email}`);

    if (!getUserIdToAdd) {
      return new NextResponse(JSON.stringify({ message: "Email does not exist" }), { status: 400 });
    }

    // check if adding self
    if (authData.user?.email === validatedEmail.email) {
      return new NextResponse(JSON.stringify({ message: "You cannot add yourself" }), { status: 400 });
    }

    // check if already added
    const isAlreadyAdded = await redis.sismember(`user:${getUserIdToAdd}:incoming_friends_request`, authData.user.id);
    if (isAlreadyAdded) {
      return new NextResponse(JSON.stringify({ message: "Already sending friend request to this user" }), {
        status: 400,
      });
    }

    // check if already friends
    const isAlreadyFriends = await redis.sismember(`user:${authData.user.id}:friends`, getUserIdToAdd);
    if (isAlreadyFriends) {
      return new NextResponse(JSON.stringify({ message: "Already friends with this user" }), { status: 400 });
    }

    //  write data to database
    pusherSever.trigger(toPusherKey(`user:${getUserIdToAdd}:request_page_incoming_friends_request`), "request_page_incoming_friends_request", {
      senderId: authData.user.id,
      senderEmail: authData.user.email,
      senderImage: authData.user.image,
    });
    pusherSever.trigger(toPusherKey(`user:${getUserIdToAdd}:sidebar_incoming_friends_request`), "sidebar_incoming_friends_request", {});

    await redis.sadd(`user:${getUserIdToAdd}:incoming_friends_request`, authData.user.id);

    return new NextResponse(JSON.stringify({ message: "OK" }), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ message: "invalid payload" }), { status: 422 });
    }

    return new NextResponse(JSON.stringify({ message: "Invalid request" }), { status: 400 });
  }
};
