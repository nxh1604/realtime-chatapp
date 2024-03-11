"use client";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { IUserData } from "@/types/db";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiSearch, FiUser, FiUserPlus } from "react-icons/fi";

const SubMainNav = ({ friendRequestsId }: { friendRequestsId: string[] | null }) => {
  const { data: session } = useSession();
  const [friendRequestsCount, setFriendRequestsCount] = useState(friendRequestsId ? friendRequestsId.length : 0);
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${session?.user.id}:incoming_friend_requests`));

    pusherClient.bind("incoming_friend_requests", (data: IUserData) => {
      console.log("client bind incoming_friend_requests", data);
      setFriendRequestsCount((prev) => ++prev);
    });

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${session?.user.id}:incoming_friend_requests`));
      pusherClient.unbind("incoming_friend_requests");
    };
  }, [session?.user.id]);
  return (
    <nav>
      <ul className="flex flex-col w-full">
        {subMainNavOptions.map((option) => (
          <li key={option.name}>
            <SubNavItem
              href={option.href}
              Icon={option.Icon}
              textLink={option.name}
              countRequests={friendRequestsCount}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SubMainNav;

const subMainNavOptions = [
  {
    name: "add friend",
    href: "/dashboard/add",
    Icon: <FiUserPlus />,
  },
  {
    name: "search friend",
    href: "/dashboard/search",
    Icon: <FiSearch />,
  },
  {
    name: "friend requests",
    href: "/dashboard/requests",
    Icon: <FiUser />,
  },
];

const SubNavItem = ({
  href,
  Icon,
  textLink,
  countRequests,
}: {
  countRequests?: number;
  textLink: string;
  href: string;
  Icon: JSX.Element;
}) => {
  const getLinkPath = href.split("/").at(-1) === "requests";
  return (
    <Link
      prefetch
      className="group hover:text-indigo-600 flex gap-4 hover:bg-indigo-50 px-4 py-3 items-center"
      href={href}>
      <div className="border-2 border-black px-1 py-[2px] group-hover:border-indigo-600 rounded-lg *:w-5 *:h-5">
        {Icon}
      </div>
      <p className="capitalize font-medium">
        {textLink}
        {getLinkPath ? (
          countRequests ? (
            <span className="ml-2 rounded-full group-hover:bg-indigo-700 bg-indigo-500 text-white w-[1.25rem] h-[1.25rem] inline-flex items-center justify-center text-sm">
              {countRequests}
            </span>
          ) : null
        ) : null}
      </p>
    </Link>
  );
};
