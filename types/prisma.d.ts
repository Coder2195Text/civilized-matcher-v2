import { User } from "@prisma/client";

type UserData = Omit<User, ["discordTag", "id"]>;
