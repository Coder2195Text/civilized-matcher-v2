import {
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  MobileNav,
  Navbar,
} from "@material-tailwind/react";
import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FC, ReactNode, useEffect, useState } from "react";
import { AiOutlineForm, AiOutlineMail } from "react-icons/ai";
import { FaChevronDown, FaDiscord } from "react-icons/fa";
import { BsFillArrowThroughHeartFill } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";
import { AuthStatus } from "@/types/next-auth";
import { BiLogOut } from "react-icons/bi";

const NAV_MAP: { [key: string]: ReactNode } = {
  "/dashboard": (
    <>
      <MdDashboard className="inline mx-2" size={32} />
      Dashboard
    </>
  ),
  "/form": (
    <>
      <AiOutlineForm className="inline mx-2" size={32} />
      Form
    </>
  ),
  "/matches": (
    <>
      <BsFillArrowThroughHeartFill className="inline mx-2" size={32} />
      Matches
    </>
  ),
  "/messages": (
    <>
      <AiOutlineMail className="inline mx-2" size={32} />
      Messages
    </>
  ),
};

const ProfileMenu: FC<{ session: Session | null; status: AuthStatus }> = ({
  session,
  status,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (status == "loading") return <span className="h-12 w-[92px]" />;
  if (status == "unauthenticated")
    return (
      <Button
        variant="text"
        color="blue-gray"
        className="flex items-start px-3 mx-3 text-2xl text-black bg-pink-300 rounded-full lg:ml-auto"
        onClick={() => signIn("discord")}
      >
        Login <FaDiscord className="inline-block ml-2" size={28} />
      </Button>
    );

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex gap-1 items-center py-1 pr-2 pl-3 mx-2 bg-pink-300 rounded-full lg:ml-auto"
        >
          {session?.user.image_url && (
            <img
              className="p-0.5 w-10 rounded-full border border-amber-300"
              src={session.user.image_url}
            />
          )}
          <FaChevronDown
            className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""
              }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="z-30 p-0 text-2xl bg-pink-600 outline-none select-none outline-transparent">
        <h6 className="p-1 outline-none decoration-transparent">
          Logged in as {session?.user.username}#{session?.user.discriminator}
        </h6>
        <MenuItem
          className="p-2 bg-red-500"
          onClick={() => {
            signOut();
          }}
        >
          Log out <BiLogOut className="inline-block ml-2" size={28} />
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const NavBar: FC = () => {
  const [openNav, setOpenNav] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="flex flex-col gap-2 my-2 select-none lg:flex-row lg:gap-6 lg:items-center lg:mt-0 lg:mb-0">
      {Object.keys(NAV_MAP).map((link) => (
        <li className="p-1 text-xl" key={link}>
          <Link
            href={link}
            onClick={() => {
              setOpenNav(false);
            }}
            className="text-slate-500"
          >
            {NAV_MAP[link]}
          </Link>
        </li>
      ))}
    </ul>
  );
  return (
    <Navbar className="fixed top-0 left-0 z-10 py-2 w-screen bg-pink-200 border-none">
      <div className="flex justify-between items-center text-blue-gray-100">
        <span className="py-1 px-3 text-2xl font-bold font-header">
          <Link
            href="/"
            className="text-amber-500 no-underline transition-all hover:font-extrabold hover:text-amber-700 hover:before:scale-x-0"
            onClick={() => {
              setOpenNav(false);
            }}
          >
            <span className="hidden mr-2 min-[350px]:inline">Matchmaking</span>
            <img src="/favicon.ico" className="inline w-7" />
          </Link>
        </span>
        <div className="hidden lg:block">{navList}</div>
        <IconButton
          variant="text"
          className="w-6 h-6 lg:hidden min-[350px]:ml-auto text-inherit"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="w-6 h-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
        <ProfileMenu session={session} status={status} />
      </div>
      <MobileNav open={openNav}>{navList}</MobileNav>
    </Navbar>
  );
};

export default NavBar;
