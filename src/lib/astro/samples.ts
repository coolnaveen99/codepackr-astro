import type { BirthInput } from "./engine";

export const DEFAULT_INPUT: BirthInput = {
  name: "",
  sex: "M",
  year: 0,
  month: 1,
  day: 1,
  hour: 6,
  minute: 0,
  tz: 5.5,
  lat: 13.0667,
  lon: 80.25,
  place: "",
  school: "thirukanitham",
};

export const POPULAR_CITIES = [
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
