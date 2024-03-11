export interface IUserData {
  email: string;
  emailVerified: Boolean | null;
  id: string;
  image: string;
  name: string;
}
export interface IFriendRequestData {
  senderId: string;
  senderImage: string;
  senderEmail: string;
}

export interface IChatChannel {}

export interface IMessage {}
