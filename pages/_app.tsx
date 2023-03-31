import NavBar from "@/components/Navbar";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <DefaultSeo
        title="Matchmaking"
        additionalMetaTags={[
          {
            name: "msapplication-TileColor",
            content: "#ff9999",
          },
          {
            name: "theme-color",
            content: "#ff9999",
          },
        ]}
        openGraph={{
          images: [
            {
              url: "https://civilized-matcher.vercel.app/favicon.ico",
              width: 240,
              height: 240,
              type: "image/png",
            },
          ],
          siteName: "Matchmaking",
        }}
      />
      <NavBar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
