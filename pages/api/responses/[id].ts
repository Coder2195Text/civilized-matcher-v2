import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { Client, GatewayIntentBits } from "discord.js";
import Joi from "joi";
import { GENDERS } from "@/globals/constants";
import prisma from "@/globals/prisma";

const dataValidator = Joi.object({
  enabled: Joi.boolean(),
  age: Joi.number()
    .min(Number(process.env.NEXT_PUBLIC_MIN_AGE))
    .max(Number(process.env.NEXT_PUBLIC_MAX_AGE)),
  preferredAges: Joi.array().items(
    Joi.number()
      .min(Number(process.env.NEXT_PUBLIC_MIN_AGE))
      .max(Number(process.env.NEXT_PUBLIC_MAX_AGE))
  ),
  gender: Joi.string().valid(...GENDERS),
  preferredGenders: Joi.array().items(Joi.string().valid(...GENDERS)),
  location: Joi.string(),
  radius: Joi.number().min(0).max(15000),
  desc: Joi.string().min(0).max(2000),
  matchDesc: Joi.string().min(0).max(2000),
  selfieUrl: Joi.string().uri().min(0).max(500),
  name: Joi.string().min(0).max(200),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;

  if (typeof query.id !== "string") {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { user } = session;

  if (query.id === "@me") query.id = user.id;

  const rank = prisma.ranks
    .findUnique({
      where: { id: user.id },
      select: {
        rank: true,
      },
    })
    .then((rank) => (rank ? rank.rank : "user"));

  if (req.method === "GET") {
    const response = prisma.user.findUnique({ where: { id: query.id } });
    if (user.id === query.id || ["admin", "matchmaker"].includes(await rank))
      res.status(200).json(await response);
    else res.status(403).json({ error: "Forbidden" });
  } else if (req.method == "PUT") {
    try {
      await dataValidator.validateAsync(req.body);
    } catch (e) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const client = new Client({ intents: [GatewayIntentBits.GuildMembers] });
    await client.login(process.env.BOT_TOKEN!);
    try {
      req.body.discordTag = await client.users
        .fetch(query.id)
        .then((u) => u.tag);
    } catch (e) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    if (user.id === query.id || (await rank) == "admin") {
      try {
        const response = await prisma.user.upsert({
          where: { id: query.id },
          update: req.body,
          create: {
            ...req.body,
            id: query.id,
          },
        });

        res.status(200).json(response);
      } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Invalid request body" });
      }
    } else res.status(403).json({ error: "Forbidden" });
  }
  // res.status(400).json({ error: "Invalid request" });
}
