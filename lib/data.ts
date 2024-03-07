import { auth } from "./auth";
import redis from "./db";

export const fetchFriendRequests = async () => {
  const session = await auth();
  if (!session) return null;

  return await redis.smembers(`user:${session.user.id}:incoming_friend_requests`);
};
