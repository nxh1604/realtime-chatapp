import { auth } from "@/lib/auth";
import redis from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { friendRequestID } = await req.json();
  const authData = await auth();

  //   check if body has friendRequestID
  if (!friendRequestID) {
    return new NextResponse(JSON.stringify({ message: "Invalid friend request ID" }), { status: 400 });
  }

  //   check authourized
  if (!authData) return new NextResponse(JSON.stringify({ message: "unauthourized" }), { status: 400 });

  return new NextResponse(JSON.stringify("OK"));
  //   await redis.smembers(`user:${authData.user.id}:friends`);
};
