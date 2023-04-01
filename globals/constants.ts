import range from "inclusive-range";

export const GENDERS = [
  "Cis Male",
  "Cis Female",
  "Trans Male",
  "Trans Female",
  "AMAB Agender",
  "AFAB Agender",
  "AMAB Bigender",
  "AFAB Bigender",
  "AMAB Genderfluid",
  "AFAB Genderfluid",
  "AMAB Demigirl",
  "AFAB Demigirl",
  "AMAB Demiboy",
  "AFAB Demiboy",
] as const;

export const AGES = Array.from(
  range(
    Number(process.env.NEXT_PUBLIC_MIN_AGE),
    Number(process.env.NEXT_PUBLIC_MAX_AGE)
  )
);

type GENDERS = (typeof GENDERS)[number];
