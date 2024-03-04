"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { LuLoader2 } from "react-icons/lu";

export default function Page() {
<<<<<<< HEAD
  const props = useSession();
  // console.log(props);
=======
>>>>>>> 854a706275b3b94216c1c77d977f2c2e7e62dce0
  const [isloading, setIsloading] = useState(false);

  const handleSignInWith = useCallback(async (provider: "google" | "github") => {
    setIsloading(true);
    try {
      await signIn(provider);
    } catch (error) {
      console.log(error);
      toast.error(`Failed to sign in with ${provider.substring(0, 1).toUpperCase() + provider.substring(1)}`);
    } finally {
      setIsloading(false);
    }
  }, []);

  return (
    <main className="flex sm:gap-8 md:p-8 flex-col-reverse md:flex-row md:flex-nowrap p-4 gap-4 items-center">
      <div className="flex-1 flex flex-col justify-between items-center">
        <div className="flex items-center flex-1">
          <div className="max-w-[388px] min-w-[340px] w-full space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-center">Welcome Back 👋</h1>
              <p className="leading-loose hidden">
                Today is a new day. It&lsquo;s your day. You shape it.
                <br />
                Sign in to start chatting with your friends.
              </p>
            </div>
            <form className="flex flex-col gap-3">
              <div>
                <label htmlFor="email">Email</label>
                <input
                  autoFocus
                  disabled={isloading}
                  autoComplete="email"
                  id="email"
                  type="email"
                  required
                  className="w-full disabled:bg-slate-300 bg-[#F7FBFF] mt-[2px] p-4 rounded-lg border-[1px] border-[#D4D7E3]"
                  placeholder="Example@email.com"
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  disabled={isloading}
                  type="password"
                  autoComplete="current-password"
                  minLength={8}
                  required
                  className="w-full disabled:bg-slate-300 bg-[#F7FBFF] mt-[2px] p-4 rounded-lg border-[1px] border-[#D4D7E3]"
                  placeholder="At least 8 characters"
                />
              </div>
              <Link href={"#"} className="underline text-[#1E4AE9] self-end pl-2 capitalize">
                Forgot password
              </Link>
              <Button type="submit" className="w-full capitalize flex items-center gap-2" disabled={isloading}>
                {isloading && <LuLoader2 className="w-7 h-7 animate-spin" />} Sign in
              </Button>
            </form>
            <div>
              <div className="flex items-center">
                <div className="flex-1 h-[2px] bg-[#CFDFE2]"></div>
                <p className="px-4 capitalize">Or</p>
                <div className="flex-1 h-[2px] bg-[#CFDFE2]"></div>
              </div>
              <div className="flex flex-wrap gap-4 items-center sm:flex-col justify-center mt-6">
                <Button
                  className="bg-[#F3F9FA] sm:pl-[92.5px] sm:justify-start text-black flex-1 sm:w-full gap-4 hover:bg-slate-300"
                  disabled={isloading}
                  onClick={() => handleSignInWith("google")}
                >
                  <FcGoogle className="w-7 h-7 " />
                  <p className="hidden sm:block">
                    Sign in with <span>Google</span>
                  </p>
                  <p className="block sm:hidden">Google</p>
                </Button>
                <Button
                  className="bg-[#F3F9FA] sm:pl-[92.5px] sm:justify-start text-black flex-1 sm:w-full gap-4 hover:bg-slate-300"
                  disabled={isloading}
                  onClick={() => handleSignInWith("github")}
                >
                  <FaGithub className="w-7 h-7 " />
                  <p className="hidden sm:block">
                    Sign in with <span>Github</span>
                  </p>
                  <p className="block sm:hidden">Github</p>
                </Button>
              </div>
            </div>
            <p className="text-center">
              Don&lsquo;t have an account? <span className="text-[#1E4AE9]">Sign up</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 self-stretch">
        <Image
          width={1400}
          height={1600}
          src={"/image/login-art.png"}
          alt="login art"
          className="h-full w-full md:max-h-[90vh] max-h-[200px] object-cover min-w-[300px] object-center rounded-md"
        />
      </div>
    </main>
  );
}
