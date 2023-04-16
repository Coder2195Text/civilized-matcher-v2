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

export const RELIGIONS = [
  "Christian",
  "Muslim",
  "Atheist",
  "Hindu",
  "Buddhist",
  "Jewish",
  "Sikh",
  "Spiritual",
  "Baha'i",
  "Jain",
  "Shinto",
  "Caodaism",
  "Zoroastrian",
  "Tenrikyo",
  "Animism",
  "Neo-Pagan",
  "Others",
];

export const AGES = Array.from(
  range(
    Number(process.env.NEXT_PUBLIC_MIN_AGE),
    Number(process.env.NEXT_PUBLIC_MAX_AGE)
  )
);

export const POLY = ["Monogamous", "Ambiamorous", "Polyamorous"] as const;

type GENDERS = (typeof GENDERS)[number];
type POLY = (typeof POLY)[number];

export const MAX_DISTANCE = 20000;
