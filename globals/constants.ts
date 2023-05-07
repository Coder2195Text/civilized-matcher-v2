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
] as const;

export const AGES = Array.from(
  range(
    Number(process.env.NEXT_PUBLIC_MIN_AGE),
    Number(process.env.NEXT_PUBLIC_MAX_AGE)
  )
);

export const POLY = ["Monogamous", "Ambiamorous", "Polyamorous"] as const;
export type GENDERS = (typeof GENDERS)[number];
export type POLY = (typeof POLY)[number];
export type RELIGIONS = (typeof RELIGIONS)[number];

export const POLY_PREFS: { [key in POLY]: POLY[] } = {
  Monogamous: ["Monogamous", "Ambiamorous"],
  Ambiamorous: ["Monogamous", "Ambiamorous", "Polyamorous"],
  Polyamorous: ["Ambiamorous", "Polyamorous"],
};

export const MAX_DISTANCE = 20000;
