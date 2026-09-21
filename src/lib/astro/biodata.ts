// Codepackr Astro - Marriage Biodata Type Definitions
import type { BirthInput } from "./engine";
import { DEFAULT_INPUT } from "./samples";

export type Biodata = {
  birth: BirthInput;
  photo: string;
  height: string;
  complexion: "fair" | "wheatish" | "dusky";
  blood: string;
  marital: "unmarried" | "divorced" | "widowed";
  religion: string;
  caste: string;
  gotra: string;
  kulaDeivam: string;
  native: string;
  cityNow: string;
  education: string;
  college: string;
  work: string;
  company: string;
  income: string;
  father: string;
  fatherJob: string;
  mother: string;
  motherJob: string;
  siblings: string;
  familyType: "joint" | "nuclear";
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  expect: string;
};

export const DEFAULT_BIODATA: Biodata = {
  birth: { ...DEFAULT_INPUT, name: "", sex: "M" },
  photo: "",
  height: "5' 6\"",
  complexion: "wheatish",
  blood: "O+",
  marital: "unmarried",
  religion: "",
  caste: "",
  gotra: "",
  kulaDeivam: "",
  native: "",
  cityNow: "",
  education: "",
  college: "",
  work: "",
  company: "",
  income: "",
  father: "",
  fatherJob: "",
  mother: "",
  motherJob: "",
  siblings: "",
  familyType: "joint",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
  expect: "",
};

export const HEIGHTS = Array.from({ length: 25 }, (_, i) => {
  const total = 54 + i;
  const ft = Math.floor(total / 12);
  const inch = total % 12;
  return `${ft}' ${inch}"`;
});

export const BLOODS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
