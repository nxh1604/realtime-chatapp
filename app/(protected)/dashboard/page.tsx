<<<<<<< HEAD
import { auth } from "@/lib/auth";

export default async function Page() {
  const authData = await auth();
  if (!authData) return null;
  console.log(authData);
  return <main>asd</main>;
=======
export default async function Page() {
  return <main>Dashboard page</main>;
>>>>>>> 854a706275b3b94216c1c77d977f2c2e7e62dce0
}
