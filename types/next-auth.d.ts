import NextAuth from "next-auth";
import { DiscordProfile } from "next-auth/providers/discord";

type AuthStatus = "authenticated" | "loading" | "unauthenticated";

declare module "next-auth" {
  interface Session {
    user: DiscordProfile;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: DiscordProfile;
    accessToken: string;
  }
}
