import React from 'react';
import { Globe, Compass, LayoutGrid } from 'lucide-react';
import { AyanamsaMode } from '../lib/astro/astronomy/ayanamsa-models';
import { SupportedLocale, REGIONAL_PRESETS, ACTIVE_LOCALES } from '../lib/astro/locales/multi-lang';

export interface AstroModelSwitcherProps {
  locale: SupportedLocale;
  onChangeLocale: (loc: SupportedLocale) => void;
  chartStyle: 'SOUTH' | 'NORTH';
  onChangeChartStyle: (style: 'SOUTH' | 'NORTH') => void;
  ayanamsa: AyanamsaMode;
  onChangeAyanamsa: (mode: AyanamsaMode) => void;
}

export const AstroModelSwitcher: React.FC<AstroModelSwitcherProps> = ({
  locale,
  onChangeLocale,
  chartStyle,
  onChangeChartStyle,
  ayanamsa,
  onChangeAyanamsa,
}) => {
  const handleLanguageSelect = (newLocale: SupportedLocale) => {
    onChangeLocale(newLocale);
    // Automatically switch default chart style when switching between North (Hindi) and South languages
    const preset = REGIONAL_PRESETS[newLocale];
    if (preset) {
      onChangeChartStyle(preset.defaultChartStyle);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 p-3 text-xs shadow-xs">
      {/* 6-Language Switcher */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1 font-semibold text-zinc-600 dark:text-zinc-400">
          <Globe className="h-3.5 w-3.5 text-amber-600" />
          <span>Language:</span>
        </span>
        <div className="flex flex-wrap gap-1">
          {ACTIVE_LOCALES.map((locKey) => {
            const item = REGIONAL_PRESETS[locKey];
            const active = (locale === "en" ? "en" : "ta") === locKey;
            return (
              <button
                key={locKey}
                type="button"
                onClick={() => handleLanguageSelect(locKey)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-amber-100'
                }`}
              >
                {item.nativeName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Style & Ayanamsa Selectors */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* South vs North Chart Toggle */}
        <div className="flex items-center gap-1.5">
          <LayoutGrid className="h-3.5 w-3.5 text-amber-600" />
          <div className="flex rounded-lg border border-amber-200 dark:border-zinc-700 p-0.5 bg-amber-50/50 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => onChangeChartStyle('SOUTH')}
              className={`rounded-md px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                chartStyle === 'SOUTH'
                  ? 'bg-amber-600 text-white'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              South Indian
            </button>
            <button
              type="button"
              onClick={() => onChangeChartStyle('NORTH')}
              className={`rounded-md px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                chartStyle === 'NORTH'
                  ? 'bg-amber-600 text-white'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              North Diamond
            </button>
          </div>
        </div>

        {/* Ayanamsa Calculation Selector */}
        <div className="flex items-center gap-1.5">
          <Compass className="h-3.5 w-3.5 text-amber-600" />
          <select
            aria-label="Select Ayanamsa Calculation Model"
            value={ayanamsa}
            onChange={(e) => onChangeAyanamsa(e.target.value as AyanamsaMode)}
            className="rounded-lg border border-amber-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 font-semibold text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer"
          >
            <option value="LAHIRI">Chitrapaksha (Lahiri)</option>
            <option value="KP_NEW">KP New (Krishnamurti)</option>
            <option value="BV_RAMAN">B.V. Raman</option>
            <option value="YUKTESHWAR">Sri Yukteshwar</option>
            <option value="TRUE_PUSHYA">Pushya Paksha</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AstroModelSwitcher;
