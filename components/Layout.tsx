import { useSession } from "next-auth/react";
import { FC, ReactNode } from "react";
import Loading from "./Loading";

const Layout: FC<{ children?: ReactNode }> = ({ children }) => {
  const { status } = useSession();

  if (status === "loading" || !children) {
    return <Loading />;
  }
  return (
    <div className="flex justify-center pt-20 w-screen px-[1vw]">
      <div className="max-w-6xl p-3 bg-[rgba(100,100,100,.5)] rounded-3xl break-words overflow-clip w-[95vw]">
        {children}
      </div>
    </div>
  );
};

export default Layout;
