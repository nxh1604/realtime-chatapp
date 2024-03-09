export interface IUserData {
  id: string;
  email: string;
  emailVerified: Boolean | null;
  image: string;
  name: string;
}
export interface IFriendRequestData {
  senderId: IUserData["id"];
  senderImage: IUserData["image"];
  senderEmail: IUserData["email"];
}

export interface IChatChannel {
  id: string;
  participants: Array<IUserData["id"]>;
  message: Array<IMessage["id"]>;
}

export interface IMessage {
  id: string;
  senderId: IUserData["id"];
  message: string;
  timeStamp: string;
}
