import { Client, GatewayIntentBits } from "discord.js";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const client = new Client({ intents: [GatewayIntentBits.DirectMessages] });
	await client.login(process.env.BOT_TOKEN!);

	// Replace YOUR_USER_ID with your Discord user ID
	const user = await client.users.fetch("1016862766079938662");

	// Replace "Hello, World!" with the message you want to send
	await user.send(
		"hey cutie why you so cute ;) ? JK JK lol TROLLING BE LIKE LOL!!! dw Im just trolling u as part of the testing of the bot dm thingy"
	);

	client.destroy();
	res.status(200).json({ message: "Message sent to Discord" });
}
