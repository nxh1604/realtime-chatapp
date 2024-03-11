"use server";
import { IChatRoom, IChatRoomMessage, IFriendRequestData, IMessage, IUserData } from "@/types/db.type";
import redis from "./db";
import { sortedIds } from "./utils";

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
    console.log("error in get Friend request Id ");
    return null;
  }
};

export const checkIsAlreadyFriend = async (userId: string, friendId: string) => {
  try {
    const isAlreadyFriend = await redis.sismember(`user:${userId}:friends`, friendId);
    return isAlreadyFriend;
  } catch (error) {
    console.log("error in check is already friend");
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
    console.log("error in get friend requests");
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
    console.log("error in get friends");
    return null;
  }
};

export const getChatRoomMessage = async (userId: string, friendId: string) => {
  try {
    const chatRoomData = (await redis.get(`room:${sortedIds(userId, friendId)}`)) as IChatRoom;
    const chatRoomMessageId = await redis.zrange(`room:message:${chatRoomData.messageId}`, 0, -1);
    const chatRoomMessage = (await Promise.all(chatRoomMessageId.map((id) => redis.get(`message:${id}`)))) as IMessage[];
    return chatRoomMessage;
  } catch (error) {
    console.log("error in get chat room message");
    return [];
  }
};
