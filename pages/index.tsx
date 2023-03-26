import { FC } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import Layout from "@/components/Layout";

const Home: FC = () => {
  const { data: session, status } = useSession();

  return <Layout />;
};

export default Home;
