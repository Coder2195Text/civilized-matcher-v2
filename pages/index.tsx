import { FC } from "react";
import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import Router from "next/router";
import { NextSeo } from "next-seo";

const Home: FC = () => {
  const { status } = useSession();

  if (typeof window !== "undefined" && status === "authenticated")
    Router.push("/dashboard");
  return (
    <>
      <NextSeo
        title="Matchmaking - Home"
        description="Matchmaking. Refined. Accurate. Reliable."
      />
      <Layout>
        {status == "unauthenticated" && (
          <div className="w-full text-center">
            <h1>Matchmaking. Refined. Accurate. Reliable.</h1>
            <div>
              Tired of old form matchmaking? <br /> Tired of a month of waiting?{" "}
              <br /> Well, if you are already a member of my discord server,
              that great matchmaking is HERE. <br /> Our matchmaking is secure,
              because you cannot fake someone else's application due to our
              Discord OAuth. Try it out now!!!
            </div>

            <br />
            <h6>
              Not expecting this? This is the new version of the app. The old
              version is{" "}
              <a
                href="https://github.com/Coder2195Text/civilized-matcher-archive"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
            </h6>
          </div>
        )}
      </Layout>
    </>
  );
};

export default Home;
