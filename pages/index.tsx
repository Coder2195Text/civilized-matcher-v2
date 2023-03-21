import { FC } from "react";
import { signIn, useSession } from "next-auth/react";

const Home: FC = () => {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return <p>Signed in as {JSON.stringify(session?.user)}</p>;
  }

  return (
    <button
      onClick={() => {
        signIn("discord");
      }}
    >
      Sign in
    </button>
  );
};

export default Home;
