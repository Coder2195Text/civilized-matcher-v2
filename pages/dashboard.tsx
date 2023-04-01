import ActionButton from "@/components/ActionButton";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Router from "next/router";
import React, { FC } from "react";
import { BsPencilSquare } from "react-icons/bs";

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
            <h1>
              Welcome back, {session.user.username}#{session.user.discriminator}
            </h1>
            <h3>Actions</h3>

            <ActionButton
              text="Manage your form"
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
              onClick={() => {
                Router.push("/form");
              }}
            >
              <BsPencilSquare className="w-full h-full" />
            </ActionButton>
          </>
        )}
      </Layout>
    </>
  );
};

export default Home;
