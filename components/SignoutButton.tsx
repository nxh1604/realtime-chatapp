"use client";

import { ComponentProps, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { createPortal } from "react-dom";

const SignoutButton = ({ children, ...props }: ComponentProps<"button">) => {
  const [isLoading, setIsloading] = useState(false);

  const handleSignOut = useCallback(async () => {
    setIsloading(true);
    try {
      await signOut();
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  }, []);

  return (
    <>
      <Button variant={"signout"} onClick={() => handleSignOut()} {...props}>
        {children}
      </Button>
      <LoadingOverLayLogout isLoading={isLoading} />
    </>
  );
};

export default SignoutButton;

const LoadingOverLayLogout = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;
  return createPortal(<div className="fixed top-0 bottom-0 right-0 left-0 bg-black/20"></div>, document.body);
};
