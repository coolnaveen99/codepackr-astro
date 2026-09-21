// Codepackr Astro - Default Input & Sample Cities
import type { BirthInput } from "./engine";

export const DEFAULT_INPUT: BirthInput = {
  name: "",
  sex: "M",
  year: 1990,
  month: 1,
  day: 1,
  hour: 6,
  minute: 0,
  tz: 5.5,
  lat: 13.0667,
  lon: 80.25,
  place: "Madras",
  school: "thirukanitham",
};

export const POPULAR_CITIES = [
  { n: "Chennai (Madras)", tz: 5.5, lon: 80.2707, lat: 13.0827 },
  { n: "Madurai", tz: 5.5, lon: 78.1198, lat: 9.9252 },
  { n: "Coimbatore", tz: 5.5, lon: 76.9558, lat: 11.0168 },
  { n: "Tiruchirappalli", tz: 5.5, lon: 78.7047, lat: 10.7905 },
  { n: "Salem", tz: 5.5, lon: 78.1460, lat: 11.6643 },
  { n: "Tirunelveli", tz: 5.5, lon: 77.7567, lat: 8.7139 },
  { n: "Erode", tz: 5.5, lon: 77.7172, lat: 11.3410 },
  { n: "Vellore", tz: 5.5, lon: 79.1325, lat: 12.9165 },
  { n: "Vaniyambadi", tz: 5.5, lon: 78.6189, lat: 12.6825 },
  { n: "Tirupattur", tz: 5.5, lon: 78.5678, lat: 12.4958 },
  { n: "Thanjavur", tz: 5.5, lon: 79.1378, lat: 10.7870 },
  { n: "Kanchipuram", tz: 5.5, lon: 79.7036, lat: 12.8342 },
  { n: "Tiruvannamalai", tz: 5.5, lon: 79.0747, lat: 12.2253 },
  { n: "Dindigul", tz: 5.5, lon: 77.9803, lat: 10.3673 },
  { n: "Nagercoil", tz: 5.5, lon: 77.4334, lat: 8.1833 },
  { n: "Bengaluru", tz: 5.5, lon: 77.5946, lat: 12.9716 },
  { n: "Singapore", tz: 8.0, lon: 103.8198, lat: 1.3521 },
];
