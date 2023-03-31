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

type GENDERS = (typeof GENDERS)[number];
