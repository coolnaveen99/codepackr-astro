import type { BirthInput } from "./engine";

export const SAMPLES: { id: string; labelTa: string; labelEn: string; input: BirthInput }[] = [
  {
    id: "thiru",
    labelTa: "திருக்குமரேசன் · வேலூர்",
    labelEn: "Thirukumaresan · Vellore",
    input: {
      name: "Thirukumaresan",
      sex: "M",
      year: 2012,
      month: 7,
      day: 25,
      hour: 13,
      minute: 58,
      tz: 5.5,
      lat: 12.9333,
      lon: 79.1167,
      place: "Vellore",
      school: "thirukanitham",
    },
  },
  {
    id: "naveen",
    labelTa: "நவீன் குமார் · வாணியம்பாடி",
    labelEn: "Naveen Kumar T · Vaniyambadi",
    input: {
      name: "Naveen Kumar T",
      sex: "M",
      year: 1990,
      month: 8,
      day: 15,
      hour: 4,
      minute: 20,
      tz: 5.5,
      lat: 12.6833,
      lon: 78.65,
      place: "Vaniyambadi (Tn)",
      school: "thirukanitham",
    },
  },
];

export const DEFAULT_INPUT = SAMPLES[0].input;

export const POPULAR_CITIES = [
  { n: "Vellore", tz: 5.5, lon: 79.1167, lat: 12.9333 },
  { n: "Vaniyambadi (Tn)", tz: 5.5, lon: 78.65, lat: 12.6833 },
  { n: "Madras", tz: 5.5, lon: 80.25, lat: 13.0667 },
  { n: "Madurai", tz: 5.5, lon: 78.1167, lat: 9.9167 },
  { n: "Coimbatore", tz: 5.5, lon: 76.9333, lat: 11.0 },
  { n: "Hosur (Tn)", tz: 5.5, lon: 77.8667, lat: 12.7333 },
  { n: "Salem", tz: 5.5, lon: 78.1667, lat: 11.6667 },
  { n: "Tiruchirapalli", tz: 5.5, lon: 78.7, lat: 10.8333 },
  { n: "Tirunelveli", tz: 5.5, lon: 77.6833, lat: 8.7333 },
  { n: "Erode (Tn)", tz: 5.5, lon: 77.7833, lat: 11.3167 },
  { n: "Bangalore", tz: 5.5, lon: 77.5833, lat: 12.9833 },
  { n: "Singapore", tz: 8.0, lon: 103.85, lat: 1.2833 },
];
