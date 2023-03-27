import NavBar from "@/components/Navbar";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <NavBar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
