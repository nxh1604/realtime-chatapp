import { auth } from "@/lib/auth";
import { getFriendRequestsId } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiSearch, FiUser, FiUserPlus } from "react-icons/fi";

const SubMainNav = async () => {
  const session = await auth();
  if (!session) notFound();
  const friendRequestsId = await getFriendRequestsId(session.user.id);
  const friendRequestsLength = friendRequestsId ? friendRequestsId.length : 0;
  return (
    <nav>
      <ul className="flex flex-col w-full">
        {subMainNavOptions.map((option) => (
          <li key={option.name}>
            <SubNavItem href={option.href} Icon={option.Icon} textLink={option.name} countRequests={friendRequestsLength} />
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

const SubNavItem = ({ href, Icon, textLink, countRequests }: { countRequests?: number; textLink: string; href: string; Icon: JSX.Element }) => {
  const getLinkPath = href.split("/").at(-1) === "requests";
  return (
    <Link prefetch className="group hover:text-indigo-600 flex gap-4 hover:bg-indigo-50 px-4 py-3 items-center" href={href}>
      <div className="border-2 border-black px-1 py-[2px] group-hover:border-indigo-600 rounded-lg *:w-5 *:h-5">{Icon}</div>
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
