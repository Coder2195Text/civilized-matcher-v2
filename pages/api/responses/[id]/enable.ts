import prisma from "@/globals/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;

  if (typeof query.id !== "string") {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  if (req.method !== "PATCH") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (typeof req.body !== "boolean") {
    res.status(400).json({ error: "Invalid body" });
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

  if (user.id === query.id || ["admin"].includes(await rank)) {
    try {
      await prisma.user.update({
        where: { id: query.id },
        data: {
          enabled: req.body,
        },
      });
    } catch (e) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(204).end();
  } else res.status(403).json({ error: "Forbidden" });
}
