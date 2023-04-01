import { useSession } from "next-auth/react";
import { FC, ReactNode } from "react";
import Loading from "./Loading";

const Layout: FC<{ children?: ReactNode }> = ({ children }) => {
  const { status } = useSession();

  if (status === "loading" || !children) {
    return <Loading />;
  }
  return (
    <div className="flex z-20 justify-center pt-20 px-[1vw]">
      <div className="max-w-6xl p-3 bg-[rgba(100,100,100,.5)] rounded-3xl break-words overflow-clip w-[95vw] overflow-x-clip">
        {children}
      </div>
    </div>
  );
};

export default Layout;
