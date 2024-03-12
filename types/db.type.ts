export interface IUserData {
  id: string;
  email: string;
  emailVerified: Boolean | null;
  image: string;
  name: string;
}

export interface IFriend {
  id: string;
  email: string;
  image: string;
}

export interface IFriendRequestData {
  senderId: IUserData["id"];
  senderImage: IUserData["image"];
  senderEmail: IUserData["email"];
}

export interface IChatRoom {
  id: string;
  participants: Array<IUserData["id"]>;
  messageId: IChatRoomMessage;
}

export interface IChatRoomMessage {
  message: IMessage[];
}

export interface IMessage {
  id: string;
  senderId: IUserData["id"];
  message: string;
  timeStamp: number;
}
