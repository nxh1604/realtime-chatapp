import { auth } from "@/lib/auth";
import FormToSendMessage from "./components/FormToSendMessage";
import { notFound } from "next/navigation";
import { checkIsAlreadyFriend, getUserById } from "@/lib/data";
import Image from "next/image";

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await auth();
  if (!session) notFound();
  const { slug: friendId } = params;
  const isAlreadyFriend = await checkIsAlreadyFriend(session.user.id, friendId);
  if (!isAlreadyFriend) return <div>Can&rsquo;t find your friend Id</div>;
  const friendData = await getUserById(friendId);
  return (
    <div className="flex flex-col w-full bg-slate-200/50">
      <div className="px-8 py-4 border-b-2 border-b-slate-400">
        {friendData ? (
          <div className="flex gap-2 items-center">
            <Image className="rounded-full w-[48px] h-[48px]" src={friendData.image} height={48} width={48} alt="user avatar" />
            <h1 className="first-letter:capitalize">{friendData.email}</h1>
          </div>
        ) : null}
      </div>
      <div className="flex-1 bg-indigo-400/10"></div>
      <FormToSendMessage friendId={friendId} sessionId={session.user.id} />
    </div>
  );
}
