"use server";
import { IFriendRequestData, IUserData } from "@/types/db";
import redis from "./db";

export const getUserById = async (userId: string) => {
  try {
    const userData = (await redis.get(`user:${userId}`)) as IUserData;

    return userData;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getFriendRequestsId = async (userId: string) => {
  try {
    const friendRequestsId = await redis.smembers(`user:${userId}:incoming_friend_requests`);
    return friendRequestsId;
  } catch (error) {
    console.log("friendRequestId-GET error: ", error);
    return null;
  }
};

export const checkIsAlreadyFriend = async (userId: string, friendId: string) => {
  try {
    const isAlreadyFriend = await redis.sismember(`user:${userId}:friends`, friendId);
    return isAlreadyFriend;
  } catch (error) {
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

<<<<<<< HEAD
export const getChatChannel = async (userId: string, friendId: string) => {};
=======
export const getChatChannel = async (userId: string, friendId: string) => {
  try {
  } catch (error) {}
};
>>>>>>> 718857063142890aa2c59daff0aac724d7dd82e6
