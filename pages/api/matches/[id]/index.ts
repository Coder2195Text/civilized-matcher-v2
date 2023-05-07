import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/globals/prisma";
import { POLY, POLY_PREFS } from "@/globals/constants";

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

  if (req.method == "GET") {
    if (query.id !== user.id && (await rank) === "user") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const [prefs, blackListed] = await Promise.all([
      prisma.user.findUnique({
        where: { id: query.id },
        select: {
          age: true,
          preferredAges: true,
          preferredGenders: true,
          gender: true,
          religion: true,
          preferredReligions: true,
          poly: true,
        },
      }),
      prisma.rejections
        .findUnique({
          where: { id: query.id },
          select: {
            rejectedBy: {
              select: {
                id: true,
              },
            },
            rejectedUsers: {
              select: {
                id: true,
              },
            },
          },
        })
        .then((rejections) =>
          rejections
            ? [
              ...rejections.rejectedBy.map((user) => user.id),
              ...rejections.rejectedUsers.map((user) => user.id),
            ]
            : []
        ),
    ]);

    if (!prefs) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    blackListed.push(query.id);

    const matches = await prisma.user.findMany({
      where: {
        id: {
          notIn: blackListed,
        },
        preferredAges: {
          array_contains: prefs.age,
        },
        preferredGenders: {
          array_contains: prefs.gender,
        },
        preferredReligions: {
          array_contains: prefs.religion,
        },
        age: {
          in: prefs.preferredAges as number[],
        },
        gender: {
          in: prefs.preferredGenders as string[],
        },
        religion: {
          in: prefs.preferredReligions as string[],
        },
        poly: {
          in: POLY_PREFS[prefs.poly as POLY],
        },
      },
    });

    res.status(200).json(matches);

    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
