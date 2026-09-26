// Codepackr Astro — Vedic Aspect (Drishti) Engine
import { angularDistance, normalize360, signIndex } from "../astronomy/coordinates";

export type AspectDetail = {
  sourcePlanet: string;
  sourceSign: number;
  targetSign: number;
  targetHouseFromSource: number; // 3, 4, 5, 7, 8, 9, 10
  aspectType: "full_7th" | "special_mars_4_8" | "special_jupiter_5_9" | "special_saturn_3_10" | "nodal_5_9";
  exactAngle: number;
  orb: number;
  ruleId: string;
  descriptionTa: string;
  descriptionEn: string;
};

/**
 * Calculates all active Vedic aspects cast by a planet on other signs/planets.
 */
export function getVedicAspectsFromPlanet(
  planetId: string,
  sourceLon: number
): AspectDetail[] {
  const p = planetId.toLowerCase();
  const sourceSign = signIndex(sourceLon);
  const aspects: AspectDetail[] = [];

  // All planets have 7th house aspect (opposition)
  const targetSign7 = (sourceSign + 6) % 12;
  aspects.push({
    sourcePlanet: p,
    sourceSign,
    targetSign: targetSign7,
    targetHouseFromSource: 7,
    aspectType: "full_7th",
    exactAngle: 180,
    orb: 0,
    ruleId: "parashara-7th-drishti",
    descriptionTa: "7-ஆம் பார்வை (முழு பார்வை)",
    descriptionEn: "7th house full aspect",
  });

  // Special Mars aspects: 4th and 8th
  if (p === "mars") {
    aspects.push(
      {
        sourcePlanet: p,
        sourceSign,
        targetSign: (sourceSign + 3) % 12,
        targetHouseFromSource: 4,
        aspectType: "special_mars_4_8",
        exactAngle: 90,
        orb: 0,
        ruleId: "mars-4th-special-aspect",
        descriptionTa: "செவ்வாய் 4-ஆம் சிறப்புப் பார்வை",
        descriptionEn: "Mars 4th house special aspect",
      },
      {
        sourcePlanet: p,
        sourceSign,
        targetSign: (sourceSign + 7) % 12,
        targetHouseFromSource: 8,
        aspectType: "special_mars_4_8",
        exactAngle: 210,
        orb: 0,
        ruleId: "mars-8th-special-aspect",
        descriptionTa: "செவ்வாய் 8-ஆம் சிறப்புப் பார்வை",
        descriptionEn: "Mars 8th house special aspect",
      }
    );
  }

  // Special Jupiter aspects: 5th and 9th
  if (p === "jupiter") {
    aspects.push(
      {
        sourcePlanet: p,
        sourceSign,
        targetSign: (sourceSign + 4) % 12,
        targetHouseFromSource: 5,
        aspectType: "special_jupiter_5_9",
        exactAngle: 120,
        orb: 0,
        ruleId: "jupiter-5th-special-aspect",
        descriptionTa: "குரு 5-ஆம் விசேஷப் பார்வை (திரிகோண பார்வை)",
        descriptionEn: "Jupiter 5th house special aspect (trine)",
      },
      {
        sourcePlanet: p,
        sourceSign,
        targetSign: (sourceSign + 8) % 12,
        targetHouseFromSource: 9,
        aspectType: "special_jupiter_5_9",
        exactAngle: 240,
        orb: 0,
        ruleId: "jupiter-9th-special-aspect",
        descriptionTa: "குரு 9-ஆம் விசேஷப் பார்வை (பாக்ய பார்வை)",
        descriptionEn: "Jupiter 9th house special aspect (trine)",
      }
    );
  }

  // Special Saturn aspects: 3rd and 10th
  if (p === "saturn") {
    aspects.push(
      {
        sourcePlanet: p,
        sourceSign,
        targetSign: (sourceSign + 2) % 12,
        targetHouseFromSource: 3,
        aspectType: "special_saturn_3_10",
        exactAngle: 60,
        orb: 0,
        ruleId: "saturn-3rd-special-aspect",
        descriptionTa: "சனி 3-ஆம் சிறப்புப் பார்வை",
        descriptionEn: "Saturn 3rd house special aspect",
      },
      {
        sourcePlanet: p,
        sourceSign,
        targetSign: (sourceSign + 9) % 12,
        targetHouseFromSource: 10,
        aspectType: "special_saturn_3_10",
        exactAngle: 270,
        orb: 0,
        ruleId: "saturn-10th-special-aspect",
        descriptionTa: "சனி 10-ஆம் சிறப்புப் பார்வை (கர்ம பார்வை)",
        descriptionEn: "Saturn 10th house special aspect",
      }
    );
  }

  // Rahu / Ketu trine aspects (5th & 9th)
  if (p === "rahu" || p === "ketu") {
    aspects.push(
      {
        sourcePlanet: p,
        sourceSign,
        targetSign: (sourceSign + 4) % 12,
        targetHouseFromSource: 5,
        aspectType: "nodal_5_9",
        exactAngle: 120,
        orb: 0,
        ruleId: "node-5th-aspect",
        descriptionTa: "நிழல் கிரகம் 5-ஆம் பார்வை",
        descriptionEn: "Lunar node 5th house aspect",
      },
      {
        sourcePlanet: p,
        sourceSign,
        targetSign: (sourceSign + 8) % 12,
        targetHouseFromSource: 9,
        aspectType: "nodal_5_9",
        exactAngle: 240,
        orb: 0,
        ruleId: "node-9th-aspect",
        descriptionTa: "நிழல் கிரகம் 9-ஆம் பார்வை",
        descriptionEn: "Lunar node 9th house aspect",
      }
    );
  }

  return aspects;
}
