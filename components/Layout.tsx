import { useSession } from "next-auth/react";
import { FC, ReactNode } from "react";
import Loading from "./Loading";

const Layout: FC<{ children?: ReactNode }> = ({ children }) => {
  const { status } = useSession();

  if (status === "loading" || !children) {
    return <Loading />;
  }
  return <div className="pt-20 w-screen break-words px-[1vw]">{children}</div>;
};

export default Layout;
