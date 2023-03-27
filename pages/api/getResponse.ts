import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;

  if (req.method !== "GET" || Array.isArray(query.id)) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { user } = session;

  if (!query.id) query.id = user.id;

  const response = prisma.user.findUnique({ where: { id: query.id } });
  const rank = prisma.ranks
    .findUnique({
      where: { id: session.user.id },
      select: {
        rank: true,
      },
    })
    .then((rank) => (rank ? rank.rank : "user"));

  if (user.id === query.id || ["admin", "matchmaker"].includes(await rank))
    res.status(200).json(await response);
  else res.status(403).json({ error: "Forbidden" });
}
