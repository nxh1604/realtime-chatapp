import { auth } from "@/lib/auth";
import FormToSendMessage from "./components/FormToSendMessage";
import { notFound } from "next/navigation";

export default function Page() {
  const session = auth();
  if (!session) notFound();

  return (
    <div className="flex flex-col w-full bg-slate-200/50">
      <div className="px-8 py-4 border-b-2 border-b-slate-400">
        <h1>Chatting with A</h1>
      </div>
      <div className="flex-1 bg-indigo-400/10"></div>
      <FormToSendMessage />
    </div>
  );
}
