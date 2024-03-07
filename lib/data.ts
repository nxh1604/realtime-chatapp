"use server";
import redis from "./db";

interface IUserData {
  email: string;
  emailVerified: Boolean | null;
  id: string;
  image: string;
  name: string;
}
interface IFriendRequestData {
  senderId: string;
  senderImage: string;
  senderEmail: string;
}

export const getFriendRequestsId = async (userId: string) => {
  try {
    const friendRequestsId = await redis.smembers(`user:${userId}:incoming_friend_requests`);
    return friendRequestsId;
  } catch (error) {
    console.log("friendRequestId-GET error: ", error);
    return null;
  }
};

export const getFriendRequests = async (userId: string) => {
  try {
    const friendRequestsId = await redis.smembers(`user:${userId}:incoming_friend_requests`);
    const friendRequestsData: Array<IFriendRequestData | null> = (
      await Promise.all(
        friendRequestsId.map(async (senderId) => {
          const senderData = await redis.get<IUserData>(`user:${senderId}`);
          return senderData;
        })
      )
    ).map((each) => {
      if (!each) return null;
      return {
        senderId: each.id,
        senderEmail: each.email,
        senderImage: each.image,
      };
    });
    return friendRequestsData;
  } catch (error) {
    console.log("friendRequest-GET error: ", error);
    return [];
  }
};

export const getFriends = async (userId: string) => {
  try {
    const friendsId = await redis.smembers(`user:${userId}:friends`);

    const friendsData = (await Promise.all(
      friendsId.map(async (id) => {
        return redis.get(`user:${id}`);
      })
    )) as Array<IUserData | null>;

    const resFriendsData = friendsData.map((friend) => {
      if (!friend) return null;
      return {
        id: friend.id,
        email: friend.email,
        image: friend.image,
      };
    });

    return resFriendsData;
  } catch (error) {
    console.log("friends-GET error: ", error);
    return null;
  }
};
