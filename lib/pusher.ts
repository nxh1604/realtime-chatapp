import PusherSever from "pusher";
import PusherClient from "pusher-js";

export const pusherSever = new PusherSever({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
  secret: process.env.PUSHER_APP_SECRET as string,
  cluster: "ap1",
  useTLS: true,
});

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string, {
  cluster: "ap1",
});
