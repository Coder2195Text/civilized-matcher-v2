import { FC } from "react";
import { signIn, useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import Router from "next/router";
import { FaDiscord } from "react-icons/fa";
import { NextSeo } from "next-seo";

const Home: FC = () => {
  const { status } = useSession();

  if (typeof window !== "undefined" && status === "authenticated")
    Router.push("/dashboard");
  return (
    <>
      <NextSeo
        title="Matchmaking - Join"
        description="Join our server to use this app!!!"
      />
      <Layout>
        {status == "unauthenticated" && (
          <div className="w-full text-center">
            <h1>Join our server to use this app!!!</h1>
            <h4>Step 1. </h4>
            <a
              href={process.env.NEXT_PUBLIC_DISCORD_INVITE}
              target="_blank"
              className="py-2 px-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Join the server!!!{" "}
              <FaDiscord className="inline-block ml-2" size={28} />
            </a>
            <h4>Step 2. </h4>
            <a
              onClick={() => {
                signIn("discord");
              }}
              className="py-2 px-4 mb-5 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 hover:cursor-pointer"
            >
              Login with Discord
              <FaDiscord className="inline-block ml-2" size={28} />
            </a>
            <h4>Hope you enjoy the app!!!</h4>
          </div>
        )}
      </Layout>
    </>
  );
};

export default Home;
