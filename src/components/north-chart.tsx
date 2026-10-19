import React from 'react';

export interface PlanetPlacement {
  id: string;
  label: string;
  rasiIndex: number; // 0 = Aries (1) .. 11 = Pisces (12)
  isRetrograde?: boolean;
  degreeText?: string;
}

export interface NorthChartProps {
  title?: string;
  subtitle?: string;
  lagnaRasiIndex: number; // 0 = Aries .. 11 = Pisces
  planets: PlanetPlacement[];
  className?: string;
}

interface HouseCoord {
  houseNumber: number; // 1 .. 12
  signNumX: number;
  signNumY: number;
  planetCenterX: number;
  planetCenterY: number;
}

// Coordinates on a 400x400 SVG canvas for the 12 counter-clockwise North Indian houses
const NORTH_HOUSE_COORDS: HouseCoord[] = [
  // House 1 (Top Center Diamond)
  { houseNumber: 1, signNumX: 200, signNumY: 172, planetCenterX: 200, planetCenterY: 100 },
  // House 2 (Top Left Triangle)
  { houseNumber: 2, signNumX: 100, signNumY: 82, planetCenterX: 100, planetCenterY: 42 },
  // House 3 (Upper Left Triangle)
  { houseNumber: 3, signNumX: 78, signNumY: 100, planetCenterX: 38, planetCenterY: 100 },
  // House 4 (Left Center Diamond)
  { houseNumber: 4, signNumX: 170, signNumY: 204, planetCenterX: 100, planetCenterY: 200 },
  // House 5 (Lower Left Triangle)
  { houseNumber: 5, signNumX: 78, signNumY: 300, planetCenterX: 38, planetCenterY: 300 },
  // House 6 (Bottom Left Triangle)
  { houseNumber: 6, signNumX: 100, signNumY: 325, planetCenterX: 100, planetCenterY: 362 },
  // House 7 (Bottom Center Diamond)
  { houseNumber: 7, signNumX: 200, signNumY: 232, planetCenterX: 200, planetCenterY: 300 },
  // House 8 (Bottom Right Triangle)
  { houseNumber: 8, signNumX: 300, signNumY: 325, planetCenterX: 300, planetCenterY: 362 },
  // House 9 (Lower Right Triangle)
  { houseNumber: 9, signNumX: 322, signNumY: 300, planetCenterX: 362, planetCenterY: 300 },
  // House 10 (Right Center Diamond)
  { houseNumber: 10, signNumX: 230, signNumY: 204, planetCenterX: 300, planetCenterY: 200 },
  // House 11 (Upper Right Triangle)
  { houseNumber: 11, signNumX: 322, signNumY: 100, planetCenterX: 362, planetCenterY: 100 },
  // House 12 (Top Right Triangle)
  { houseNumber: 12, signNumX: 300, signNumY: 82, planetCenterX: 300, planetCenterY: 42 },
];

export const NorthChart: React.FC<NorthChartProps> = ({
  title = 'Lagna Kundli (North Indian)',
  subtitle,
  lagnaRasiIndex,
  planets,
  className = '',
}) => {
  // Group planets by house (1..12) relative to Lagna
  const getHouseData = (houseNum: number) => {
    // Rasi index in this house (0..11)
    const rasiIndex = (lagnaRasiIndex + (houseNum - 1)) % 12;
    const rasiNumber = rasiIndex + 1; // 1 = Aries .. 12 = Pisces
    const housePlanets = planets.filter((p) => p.rasiIndex === rasiIndex);
    return { rasiNumber, housePlanets };
  };

  return (
    <div className={`rounded-2xl border bg-amber-50/40 dark:bg-zinc-900/80 p-4 shadow-sm ${className}`}>
      {(title || subtitle) && (
        <div className="mb-3 flex items-center justify-between border-b border-amber-200/70 dark:border-zinc-800 pb-2">
          <div>
            <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">{title}</h3>
            {subtitle && <p className="text-xs text-amber-800/75 dark:text-zinc-400">{subtitle}</p>}
          </div>
          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
            North Indian Style
          </span>
        </div>
      )}

      <div className="relative mx-auto aspect-square w-full max-w-[400px]">
        <svg
          viewBox="0 0 400 400"
          className="h-full w-full select-none overflow-visible"
          role="img"
          aria-label={title}
        >
          {/* Outer Square Frame */}
          <rect
            x="4"
            y="4"
            width="392"
            height="392"
            rx="8"
            fill="currentColor"
            className="text-amber-50/70 dark:text-zinc-900"
            stroke="#d97706"
            strokeWidth="2.5"
          />

          {/* Diagonal X Lines */}
          <line x1="4" y1="4" x2="396" y2="396" stroke="#d97706" strokeWidth="1.8" />
          <line x1="396" y1="4" x2="4" y2="396" stroke="#d97706" strokeWidth="1.8" />

          {/* Inner Diamond Lines connecting midpoints */}
          <polygon
            points="200,4 4,200 200,396 396,200"
            fill="none"
            stroke="#d97706"
            strokeWidth="2"
          />

          {/* Render Rasi Numbers & Planets inside each of the 12 Houses */}
          {NORTH_HOUSE_COORDS.map((coord) => {
            const { rasiNumber, housePlanets } = getHouseData(coord.houseNumber);

            return (
              <g key={coord.houseNumber}>
                {/* Zodiac Sign Number (1-12) */}
                <text
                  x={coord.signNumX}
                  y={coord.signNumY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-amber-700/80 dark:fill-amber-400/80 font-mono text-[11px] font-bold"
                >
                  {rasiNumber}
                </text>

                {/* Lagna Marker in House 1 */}
                {coord.houseNumber === 1 && (
                  <text
                    x={200}
                    y={52}
                    textAnchor="middle"
                    className="fill-rose-600 dark:fill-rose-400 text-[10px] font-extrabold uppercase tracking-wider"
                  >
                    Lagna
                  </text>
                )}

                {/* Planets in this house */}
                {housePlanets.map((planet, idx) => {
                  // Offset multiple planets neatly around the center of the house
                  const total = housePlanets.length;
                  const row = Math.floor(idx / 2);
                  const col = idx % 2;
                  const xOffset = total === 1 ? 0 : col === 0 ? -18 : 18;
                  const yOffset = (row - Math.floor((total - 1) / 4)) * 15;

                  return (
                    <text
                      key={planet.id}
                      x={coord.planetCenterX + xOffset}
                      y={coord.planetCenterY + yOffset}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-zinc-900 dark:fill-zinc-100 text-xs font-bold"
                    >
                      {planet.label}
                      {planet.isRetrograde ? '*' : ''}
                    </text>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default NorthChart;
