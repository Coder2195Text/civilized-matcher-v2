import { FC } from "react";
import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import Router from "next/router";
import { NextSeo } from "next-seo";

const Form: FC = () => {
  const { status } = useSession();

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
            <h1>Form</h1>
          </>
        )}
      </Layout>
    </>
  );
};

export default Form;
