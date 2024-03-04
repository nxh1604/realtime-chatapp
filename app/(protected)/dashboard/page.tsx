import { auth } from "@/lib/auth";

export default async function Page() {
  const authData = await auth();
  if (!authData) return null;
  console.log(authData);
  return <main>asd</main>;
}
