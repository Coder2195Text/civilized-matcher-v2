import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import { User } from "@prisma/client";

const Matches: FC = () => {
  const { status } = useSession();
  const [matches, setMatches] = useState<User[]>();
  return (
    <Layout>
      {status == "authenticated" && (
        <>
          <h1>Your Matches</h1>
        </>
      )}
    </Layout>
  );
};

export default Matches;
