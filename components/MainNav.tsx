import { AiFillMessage } from "react-icons/ai";
import Avatar from "./Avatar";
import Link from "next/link";
import SignoutButton from "./SignoutButton";
import { auth } from "@/lib/auth";
import { FiLogOut } from "react-icons/fi";

const MainNav = async () => {
  const session = await auth();
  return (
    <nav className="w-[64px] h-screen bg-indigo-500 flex flex-col py-4">
      <div className="flex justify-center items-center py-4">
        <Avatar src={session?.user?.image || "image/login-art.png"} />
      </div>
      <div className="flex flex-col justify-between gap-2 flex-1">
        <ul>
          {mainNavOptionsTop.map((option) => (
            <li key={option.name}>
              <MainNavItem href={option.href} Icon={option.Icon} />
            </li>
          ))}
        </ul>
        <ul>
          {/* {mainNavOptionsBottom.map((option) => (
            <li key={option.name}>
              <MainNavItem href={option.href} Icon={option.Icon} />
            </li>
          ))} */}
          <li>
            <SignoutButton className="*:w-7 *:h-7 w-full h-16 flex justify-center py-4 text-white hover:bg-indigo-400 hover:text-gray-100">
              <FiLogOut className="rotate-180" />
            </SignoutButton>
          </li>
        </ul>
      </div>
    </nav>
  );
};

const mainNavOptionsTop = [
  {
    name: "message",
    href: "/dashboard",
    Icon: <AiFillMessage />,
  },
];

const mainNavOptionsBottom = [{}];

export default MainNav;

const MainNavItem = ({ Icon, href }: { Icon: JSX.Element; href: string }) => {
  return (
    <Link
      className="*:w-7 *:h-7 h-16 flex justify-center py-4 text-white hover:bg-indigo-400 hover:text-gray-100"
      href={href}>
      {Icon}
    </Link>
  );
};
