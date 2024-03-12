import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { checkIsAlreadyFriend, getChatRoomMessage, getUserById } from "@/lib/data";
import Image from "next/image";
import ChatRoom from "./components/ChatRoom";

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await auth();
  if (!session) notFound();
  const { slug: friendId } = params;
  const isAlreadyFriend = await checkIsAlreadyFriend(session.user.id, friendId);
  if (!isAlreadyFriend) return <div>Can&rsquo;t find your friend Id</div>;
  const friendData = await getUserById(friendId);
  const chatRoomMessage = await getChatRoomMessage(session.user.id, friendId);
  const initialMessages = chatRoomMessage
    .map((message) => {
      return {
        ...message,
        sending: false,
      };
    })
    .reverse();

  return (
    <div className="flex flex-col w-full bg-slate-200/50 max-h-screen">
      {friendData ? (
        <>
          <div className="flex gap-2 items-center h-[64px] pl-4 border-b-2 bg-gradient-to-r from-cyan-400 to-indigo-300">
            <Image className="rounded-full w-[48px] h-[48px]" src={friendData.image} height={48} width={48} alt="user avatar" />
            <h1 className="first-letter:capitalize">{friendData.email}</h1>
          </div>
          <ChatRoom initialMessages={initialMessages} friendId={friendId} userId={session.user.id} friendImage={friendData.image} />
        </>
      ) : null}
    </div>
  );
}
