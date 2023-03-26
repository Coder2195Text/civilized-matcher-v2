import { FC } from "react";
import { signIn, useSession } from "next-auth/react";
import Layout from "@/components/Layout";

const Home: FC = () => {
  const { data: session, status } = useSession();

  return <Layout>test lodfdfg</Layout>;
};

export default Home;
