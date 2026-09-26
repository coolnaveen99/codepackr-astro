// Codepackr Astro — Classical Yoga Rule Registry
import { houseFrom } from "../chart/houses";
import { SIGN_LORDS } from "../chart/dignity";
import type { AstrologyRule, RuleEvaluationContext, RuleMatchResult } from "./registry";

export const YOGA_RULES: AstrologyRule[] = [
  {
    ruleId: "gaja-kesari-yoga",
    nameTa: "கஜகேசரி யோகம்",
    nameEn: "Gaja Kesari Yoga",
    tradition: "Parashari",
    sourceReference: "Brihat Parashara Hora Shastra, Ch. 36; Phaladeepika, Ch. 6, Sl. 25",
    priority: "primary",
    evaluate: (ctx) => {
      const moon = ctx.bodies.moon;
      const jup = ctx.bodies.jupiter;
      if (!moon || !jup) return null;

      const h = houseFrom(jup.sign, moon.sign);
      if ([1, 4, 7, 10].includes(h)) {
        return {
          ruleId: "gaja-kesari-yoga",
          nameTa: "கஜகேசரி யோகம்",
          nameEn: "Gaja Kesari Yoga",
          category: "yoga",
          sourceReference: "Phaladeepika, Ch. 6, Sl. 25",
          isPositive: true,
          evidenceFactors: [
            `சந்திரனுக்கு ${h}-ஆம் கேந்திர வீட்டில் குரு பகவான் அமர்ந்துள்ளார்.`,
            `Jupiter is in the ${h}th Kendra house from natal Moon.`,
          ],
          explanationTa:
            "சந்திரனுக்கு கேந்திரத்தில் (1, 4, 7, 10) குரு பகவான் அமைந்திருப்பதால் கஜகேசரி யோகம் உண்டாகிறது. இது நுண்ணறிவு, நற்பெயர், தலைமைப் பண்பு மற்றும் சமூக மரியாதையை பாரம்பரிய ஜோதிட விதிகளின்படி குறிக்கிறது.",
          explanationEn:
            "Formed when Jupiter is in a Kendra (1, 4, 7, or 10) from the Moon. Traditionally signifies enduring intellect, honor, and leadership capacity.",
        };
      }
      return null;
    },
  },
  {
    ruleId: "budha-aditya-yoga",
    nameTa: "புத-ஆதித்ய யோகம் (நிபுணத்துவ யோகம்)",
    nameEn: "Budha-Aditya Yoga",
    tradition: "Parashari",
    sourceReference: "Brihat Parashara Hora Shastra, Ch. 36",
    priority: "secondary",
    evaluate: (ctx) => {
      const sun = ctx.bodies.sun;
      const merc = ctx.bodies.mercury;
      if (!sun || !merc) return null;

      if (sun.sign === merc.sign && !merc.combust) {
        return {
          ruleId: "budha-aditya-yoga",
          nameTa: "புத-ஆதித்ய யோகம் (நிபுணத்துவ யோகம்)",
          nameEn: "Budha-Aditya Yoga",
          category: "yoga",
          sourceReference: "Brihat Parashara Hora Shastra, Ch. 36",
          isPositive: true,
          evidenceFactors: [
            "சூரியனும் புதனும் ஒரே ராசியில் அஸ்தமன தோஷமின்றி இணைந்துள்ளனர்.",
            "Sun and Mercury occupy the same sign without severe combustion.",
          ],
          explanationTa:
            "சூரியன் மற்றும் புதன் ஒரே ராசியில் கூடி அமைவதால் புத-ஆதித்ய யோகம் உருவாகிறது. இது கல்வி அறிவு, கணக்கீடு, நிர்வாகத் திறன் மற்றும் கூர்மையான புத்திசாலித்தனத்தை பாரம்பரிய ஜோதிடத்தில் சுட்டுகிறது.",
          explanationEn:
            "Formed by the conjunction of the Sun and Mercury. Traditionally associated with analytical skill, scholarship, and administrative ability.",
        };
      }
      return null;
    },
  },
  {
    ruleId: "chandra-mangala-yoga",
    nameTa: "சந்திர-மங்கள யோகம்",
    nameEn: "Chandra-Mangala Yoga",
    tradition: "Parashari",
    sourceReference: "Jataka Parijata, Ch. 7; Phaladeepika, Ch. 6",
    priority: "secondary",
    evaluate: (ctx) => {
      const moon = ctx.bodies.moon;
      const mars = ctx.bodies.mars;
      if (!moon || !mars) return null;

      if (moon.sign === mars.sign) {
        return {
          ruleId: "chandra-mangala-yoga",
          nameTa: "சந்திர-மங்கள யோகம்",
          nameEn: "Chandra-Mangala Yoga",
          category: "yoga",
          sourceReference: "Jataka Parijata, Ch. 7",
          isPositive: true,
          evidenceFactors: [
            "சந்திரனும் செவ்வாயும் ஒரே ராசியில் இணைந்துள்ளனர்.",
            "Moon and Mars are conjunct in the same sign.",
          ],
          explanationTa:
            "சந்திரனும் செவ்வாயும் இணைவது சந்திர-மங்கள யோகம் ஆகும். இது விடாமுயற்சி, சொத்து உருவாக்கம் மற்றும் பொருளாதார சுறுசுறுப்பைக் குறிக்கும் பாரம்பரிய அமைப்பாகும்.",
          explanationEn:
            "Formed by the conjunction of Moon and Mars. Traditionally linked with entrepreneurial vigor and asset acquisition.",
        };
      }
      return null;
    },
  },
  {
    ruleId: "dharma-karmadhipati-yoga",
    nameTa: "தர்ம-கர்மாதிபதி யோகம்",
    nameEn: "Dharma-Karmadhipati Yoga",
    tradition: "Parashari",
    sourceReference: "Brihat Parashara Hora Shastra, Ch. 34 (Raja Yogas)",
    priority: "primary",
    evaluate: (ctx) => {
      // 9th and 10th lords from Lagna
      const lord9 = SIGN_LORDS[(ctx.lagnaSign + 8) % 12]!;
      const lord10 = SIGN_LORDS[(ctx.lagnaSign + 9) % 12]!;
      const b9 = ctx.bodies[lord9];
      const b10 = ctx.bodies[lord10];
      if (!b9 || !b10) return null;

      // Conjunction or mutual aspect
      const sameSign = b9.sign === b10.sign;
      const opposition = Math.abs(b9.sign - b10.sign) === 6;

      if (sameSign || opposition) {
        return {
          ruleId: "dharma-karmadhipati-yoga",
          nameTa: "தர்ம-கர்மாதிபதி யோகம்",
          nameEn: "Dharma-Karmadhipati Yoga",
          category: "yoga",
          sourceReference: "Brihat Parashara Hora Shastra, Ch. 34",
          isPositive: true,
          evidenceFactors: [
            `9-ஆம் அதிபதி (${lord9}) மற்றும் 10-ஆம் அதிபதி (${lord10}) ${sameSign ? "இணைந்துள்ளனர்" : "நேருக்கு நேர் பார்த்துக் கொள்கின்றனர்"}.`,
            `9th lord and 10th lord are ${sameSign ? "conjunct" : "in mutual aspect"}.`,
          ],
          explanationTa:
            "பாக்கிய ஸ்தானாதிபதியும் (9) கர்ம ஸ்தானாதிபதியும் (10) இணைவது மிக உயர்ந்த ராஜயோகமாகும். இது சமூகத்தில் நற்பெயர், தொழில் வளர்ச்சி மற்றும் தர்ம சிந்தனையைக் குறிக்கிறது.",
          explanationEn:
            "A potent Raja Yoga formed by the mutual relationship of the 9th lord (Dharma) and 10th lord (Karma). Represents righteous achievement, career prominence, and honor.",
        };
      }
      return null;
    },
  },
  {
    ruleId: "neecha-bhanga-raja-yoga",
    nameTa: "நீச பங்க ராஜ யோகம்",
    nameEn: "Neecha Bhanga Raja Yoga",
    tradition: "Parashari",
    sourceReference: "Phaladeepika, Ch. 6, Sl. 26-28",
    priority: "primary",
    evaluate: (ctx) => {
      // Check if any planet is debilitated and has its dispositor in Kendra from Lagna or Moon
      const planets = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];
      const debSigns: Record<string, number> = {
        sun: 6, moon: 7, mars: 3, mercury: 11, jupiter: 9, venus: 5, saturn: 0,
      };

      for (const p of planets) {
        const body = ctx.bodies[p];
        if (body && body.sign === debSigns[p]) {
          const dispositor = SIGN_LORDS[body.sign]!;
          const dispBody = ctx.bodies[dispositor];
          if (dispBody) {
            const hLagna = houseFrom(dispBody.sign, ctx.lagnaSign);
            const hMoon = houseFrom(dispBody.sign, ctx.moonSign);
            if ([1, 4, 7, 10].includes(hLagna) || [1, 4, 7, 10].includes(hMoon)) {
              return {
                ruleId: "neecha-bhanga-raja-yoga",
                nameTa: "நீச பங்க ராஜ யோகம்",
                nameEn: "Neecha Bhanga Raja Yoga",
                category: "yoga",
                sourceReference: "Phaladeepika, Ch. 6, Sl. 26-28",
                isPositive: true,
                evidenceFactors: [
                  `நீசம் பெற்ற கிரகம் (${p}) அதிபதியான ${dispositor}, கேந்திர ஸ்தானத்தில் அமர்ந்துள்ளார்.`,
                  `Dispositor of debilitated ${p} is placed in a Kendra house.`,
                ],
                explanationTa:
                  "நீசமடைந்த கிரகத்தின் ராசி அதிபதி லக்னம் அல்லது சந்திரனுக்கு கேந்திரத்தில் இருப்பதால் நீச தோஷம் நீங்கி, போராட்டங்களுக்குப் பின் பெரிய வெற்றியைத் தரும் நீசபங்க ராஜயோகம் உண்டாகிறது.",
                explanationEn:
                  "Formed when the dispositor of a debilitated planet is in a Kendra from Lagna or Moon. Traditionally indicates triumph and rise following initial challenges.",
              };
            }
          }
        }
      }
      return null;
    },
  },
  {
    ruleId: "vipareeta-raja-yoga",
    nameTa: "விபரீத ராஜ யோகம்",
    nameEn: "Vipareeta Raja Yoga",
    tradition: "Parashari",
    sourceReference: "Uttara Kalamrita, Ch. 4, Sl. 22",
    priority: "secondary",
    evaluate: (ctx) => {
      // Lords of 6, 8, 12 in 6, 8, or 12
      const lord6 = SIGN_LORDS[(ctx.lagnaSign + 5) % 12]!;
      const lord8 = SIGN_LORDS[(ctx.lagnaSign + 7) % 12]!;
      const lord12 = SIGN_LORDS[(ctx.lagnaSign + 11) % 12]!;
      const dusthanaSigns = [
        (ctx.lagnaSign + 5) % 12,
        (ctx.lagnaSign + 7) % 12,
        (ctx.lagnaSign + 11) % 12,
      ];

      const b8 = ctx.bodies[lord8];
      if (b8 && dusthanaSigns.includes(b8.sign)) {
        return {
          ruleId: "vipareeta-raja-yoga",
          nameTa: "விபரீத ராஜ யோகம் (சரள யோகம்)",
          nameEn: "Vipareeta Raja Yoga (Sarala)",
          category: "yoga",
          sourceReference: "Uttara Kalamrita, Ch. 4",
          isPositive: true,
          evidenceFactors: [
            `8-ஆம் அதிபதி (${lord8}) துர்க்கான ஸ்தானத்தில் (6, 8, 12) அமைந்துள்ளார்.`,
            `8th lord is situated in a Dusthana (6, 8, or 12).`,
          ],
          explanationTa:
            "மறைவு ஸ்தான அதிபதிகள் மறைவு ஸ்தானங்களிலேயே அமைவது விபரீத ராஜயோகமாகும். இது எதிர்பாராத திருப்பங்கள் மற்றும் சவாலான சூழ்நிலைகளில் இருந்தும் மீண்டு முன்னேறும் ஆற்றலைக் குறிக்கிறது.",
          explanationEn:
            "Formed when Dusthana lords occupy Dusthanas without benefic affliction. Denotes unexpected resilience and victory emerging from crisis.",
        };
      }
      return null;
    },
  },
];

/**
 * Evaluates all registered Yogas against a given chart context.
 */
export function evaluateAllYogas(ctx: RuleEvaluationContext): RuleMatchResult[] {
  const matches: RuleMatchResult[] = [];
  for (const rule of YOGA_RULES) {
    const res = rule.evaluate(ctx);
    if (res) {
      matches.push(res);
    }
  }
  return matches;
}
