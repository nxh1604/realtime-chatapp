import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { checkIsAlreadyFriend, getUserById } from "@/lib/data";
import Image from "next/image";
import ChatRoom from "./components/ChatRoom";

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await auth();
  if (!session) notFound();
  const { slug: friendId } = params;
  const isAlreadyFriend = await checkIsAlreadyFriend(session.user.id, friendId);
  if (!isAlreadyFriend) return <div>Can&rsquo;t find your friend Id</div>;
  const friendData = await getUserById(friendId);
  return (
    <div className="flex flex-col w-full bg-slate-200/50 max-h-screen">
      {friendData ? (
        <>
          <div className="flex gap-2 items-center h-[64px] pl-4 border-b-2 bg-gradient-to-r from-cyan-400 to-indigo-300">
            <Image
              className="rounded-full w-[48px] h-[48px]"
              src={friendData.image}
              height={48}
              width={48}
              alt="user avatar"
            />
            <h1 className="first-letter:capitalize">{friendData.email}</h1>
          </div>
          <ChatRoom
            initialMessages={[
              { text: "hello", senderId: session.user.id },
              { text: "Hi", senderId: friendId },
              { text: "how are u?", senderId: session.user.id },
              { text: "I'm fine thanks you. What about you?", senderId: friendId },
              { text: "Oh, i'm good. Do you want to have lunch?", senderId: session.user.id },
              { text: "Sure", senderId: friendId },
              { text: "Nice, let's have lunch together. Meet you at canteen", senderId: session.user.id },
              { text: "No don't go to cabin. I want to eat noodles. Let go to TCV street", senderId: friendId },
              { text: "Okay, let's go", senderId: session.user.id },
              { text: "Okay", senderId: friendId },
              {
                text: "Before we go i wannt say. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque, voluptatibus! Placeat minus dolorum tempora fuga animi, corporis veniam praesentium obcaecati maiores eligendi impedit, repellendus ex nemo sunt quibusdam, dolore unde. Aperiam sit mollitia tempore numquam? Libero tempora error soluta. Nam necessitatibus aliquid velit earum dolorum vero ad sint iure neque",
                senderId: friendId,
              },
            ]}
            friendId={friendId}
            userId={session.user.id}
          />
        </>
      ) : null}
    </div>
  );
}
