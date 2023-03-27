import { FC } from "react";
import { signIn, useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import Router from "next/router";
import { NextSeo } from "next-seo";

const Home: FC = () => {
  const { data: session, status } = useSession();

  if (typeof window !== "undefined" && status === "unauthenticated")
    Router.push("/");
  return (
    <>
      <NextSeo
        title="Matchmaking - Dashboard"
        description="Manage your matchmaking profile and more."
      />
      <Layout>
        {status == "authenticated" && (
          <>
            <h1>Dashboard</h1>
          </>
        )}
      </Layout>
    </>
  );
};

export default Home;
