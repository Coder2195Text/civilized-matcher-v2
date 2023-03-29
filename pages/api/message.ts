import { Client, GatewayIntentBits } from "discord.js";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Replace YOUR_DISCORD_BOT_TOKEN with your bot's token
  const client = new Client({
    intents: [GatewayIntentBits.GuildMembers],
  });
  await client.login(
    "MTA4NzA1MzMwNDE2NjYxMzEwNQ.GKX0pP.87GD2VTlF6HvWEo0CeNqT1hgf5T-VuGa45dcd8"
  );

  // Replace YOUR_USER_ID with your Discord user ID
  const user = await (
    await client.guilds.fetch(process.env.SERVER_ID!)
  ).members.fetch("1052782263651291268");

  // Replace "Hello, World!" with the message you want to send
  user.send("if u recieve this say UWU in the group chat :)");

  res.status(200).json({ message: "Message sent to Discord" });
  client.destroy();
}
