import { Client, GatewayIntentBits } from "discord.js";
import NextAuth, { AuthOptions } from "next-auth";
import { OAuthConfig, OAuthUserConfig } from "next-auth/providers";
import { DiscordProfile } from "next-auth/providers/discord";

function DiscordProvider<P extends DiscordProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "discord",
    name: "Discord",
    type: "oauth",
    authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
    token: "https://discord.com/api/oauth2/token",
    userinfo: "https://discord.com/api/users/@me",
    profile(profile) {
      if (profile.avatar === null) {
        const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
        profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
      } else {
        const format = profile.avatar.startsWith("a_") ? "gif" : "png";
        profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
      }
      return profile;
    },
    style: {
      logo: "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/discord.svg",
      logoDark:
        "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/discord-dark.svg",
      bg: "#fff",
      text: "#7289DA",
      bgDark: "#7289DA",
      textDark: "#fff",
    },
    options,
  };
}

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      if (session?.user) {
        session.user = {
          ...token.user,
          ...session.user,
        };
      }
      return session;
    },
    async jwt({ user, token, account }) {
      if (user) {
        token.user = user as DiscordProfile;
      }
      if (account) {
        token.accessToken = account.access_token!;
      }
      return token;
    },
    async signIn({ user }) {
      const client = new Client({ intents: [GatewayIntentBits.GuildMembers] });
      await client.login(process.env.BOT_TOKEN!);

      try {
        // get the server by ID
        const guild = await client.guilds.fetch(process.env.SERVER_ID!);

        // check if the user is in the server
        await guild.members.fetch(user.id);

        return true;
      } catch (error) {
        return "/join";
      } finally {
        client.destroy();
      }
    },
  },

  session: {
    strategy: "jwt",
  },
};

//@ts-ignore
export default NextAuth(authOptions);
