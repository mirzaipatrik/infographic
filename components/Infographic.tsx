import type { ComponentType } from "react";
import { Libre_Baskerville } from "next/font/google";
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import type { Category, CategoryColor, InfographicData } from "@/lib/data";

const serif = Libre_Baskerville({ weight: ["400", "700"], subsets: ["latin"] });

/** Icons by theme key: Social Action (emerald) keeps the community icon; others match discourse, teaching, gatherings. */
const iconByColor: Record<
  CategoryColor,
  ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  emerald: UserGroupIcon,
  violet: ChatBubbleLeftRightIcon,
  amber: BookOpenIcon,
  rose: CalendarDaysIcon,
};

type ColorKey = CategoryColor;

const columnTheme: Record<
  ColorKey,
  {
    shell: string;
    tab: string;
    iconWrap: string;
    columnNum: string;
    fade: string;
  }
> = {
  violet: {
    shell: "from-violet-200/80 via-violet-50/90 to-white",
    tab: "bg-violet-500/95 text-white shadow-sm",
    iconWrap: "bg-white/80 text-violet-700 ring-1 ring-violet-200/80",
    columnNum: "text-violet-200/90",
    fade: "from-violet-300/25 to-transparent",
  },
  rose: {
    shell: "from-indigo-200/70 via-violet-50/80 to-white",
    tab: "bg-indigo-500/95 text-white shadow-sm",
    iconWrap: "bg-white/80 text-indigo-700 ring-1 ring-indigo-200/70",
    columnNum: "text-indigo-200/90",
    fade: "from-indigo-300/20 to-transparent",
  },
  amber: {
    shell: "from-sky-200/75 via-sky-50/90 to-white",
    tab: "bg-sky-500/95 text-white shadow-sm",
    iconWrap: "bg-white/80 text-sky-700 ring-1 ring-sky-200/80",
    columnNum: "text-sky-200/90",
    fade: "from-sky-300/25 to-transparent",
  },
  emerald: {
    shell: "from-teal-200/75 via-cyan-50/90 to-white",
    tab: "bg-teal-600/95 text-white shadow-sm",
    iconWrap: "bg-white/80 text-teal-700 ring-1 ring-teal-200/80",
    columnNum: "text-teal-200/90",
    fade: "from-teal-300/25 to-transparent",
  },
};

function SectionHeading({ name }: { name: string }) {
  const match = name.match(/^(.+?)\s*[-–—]\s*(.+)$/);
  if (match) {
    const [, a, b] = match;
    return (
      <h3 className="text-[0.65rem] sm:text-xs font-bold tracking-[0.14em] uppercase text-stone-800 leading-snug print:text-[7.5pt] print:tracking-[0.12em]">
        {a.trim()}{" "}
        <span className="font-normal text-stone-400 print:text-stone-500" aria-hidden>
          —
        </span>{" "}
        <span className="italic font-semibold normal-case tracking-normal text-stone-600 print:text-stone-700">
          {b.trim()}
        </span>
      </h3>
    );
  }
  return (
    <h3 className="text-[0.65rem] sm:text-xs font-bold tracking-[0.14em] uppercase text-stone-800 leading-snug print:text-[7.5pt] print:tracking-[0.12em]">
      {name}
    </h3>
  );
}

function CategoryColumn({ cat, index }: { cat: Category; index: number }) {
  const theme = columnTheme[cat.color] ?? columnTheme.emerald;
  const Icon = iconByColor[cat.color] ?? iconByColor.emerald;
  const tabText = (cat.tabLabel ?? cat.title).toUpperCase();

  return (
    <article
      className={`relative flex h-full flex-col rounded-[1.35rem] bg-gradient-to-b ${theme.shell} shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] ring-1 ring-black/[0.04] overflow-hidden min-h-0 print:h-auto print:overflow-visible print:shadow-none print:ring-1 print:ring-stone-400/60`}
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${theme.fade} print:h-16`} aria-hidden />

      <div className="relative px-4 pt-4 sm:px-5 sm:pt-5 print:px-3 print:pt-3">
        <div className="flex justify-start">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[0.6rem] sm:text-[0.65rem] font-semibold tracking-[0.2em] print:px-2.5 print:py-0.5 print:text-[6.5pt] print:tracking-[0.16em] ${theme.tab}`}
          >
            {tabText}
          </span>
        </div>

        <div className="flex justify-center mt-5 mb-4">
          <div
            className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.25)] print:shadow-none print:h-12 print:w-12 print:rounded-xl ${theme.iconWrap}`}
          >
            <Icon className="h-7 w-7 sm:h-8 sm:w-8 print:h-6 print:w-6" strokeWidth={1.25} />
          </div>
        </div>

        <div className={`text-center px-1 ${serif.className}`}>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-tight tracking-tight print:text-[11pt] print:leading-snug">
            {cat.title}
          </h2>
          {cat.description ? (
            <p className="mt-2 text-xs sm:text-sm text-stone-600 italic leading-relaxed max-w-[18rem] mx-auto print:text-[8pt] print:mt-1.5">
              {cat.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="relative flex-1 px-3 pb-3 pt-2 sm:px-4 sm:pb-4 flex flex-col gap-3 print:px-2.5 print:pb-2 print:gap-2 print:pt-1.5">
        {cat.subcategories.map((sub) => (
          <div
            key={sub.id}
            className="rounded-2xl bg-white/95 backdrop-blur-[2px] px-3.5 py-3 sm:px-4 sm:py-3.5 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.2)] ring-1 ring-stone-200/80 print:shadow-none print:ring-1 print:ring-stone-400/50 print:bg-white print:break-inside-avoid print:px-3 print:py-2.5 print:rounded-xl"
          >
            <SectionHeading name={sub.name} />
            <ul className="mt-2.5 space-y-2">
              {sub.bullets.map((b) => (
                <li
                  key={b.id}
                  className="flex items-start gap-2.5 text-[0.8125rem] sm:text-sm text-stone-700 leading-relaxed print:text-[7.5pt] print:leading-snug print:gap-2"
                >
                  <span
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-stone-400/90"
                    aria-hidden
                  />
                  <span>{b.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className={`mt-auto flex justify-center pb-3 sm:pb-4 pt-1 select-none ${serif.className} ${theme.columnNum} print:pb-2 print:pt-0`}
        aria-hidden
      >
        <span className="text-5xl sm:text-6xl font-bold leading-none opacity-90 print:text-5xl print:opacity-100">
          {index + 1}
        </span>
      </div>
    </article>
  );
}

export default function Infographic({ data }: { data: InfographicData }) {
  const count = data.categories.length;

  const gridClass =
    count <= 1
      ? "grid-cols-1 max-w-lg mx-auto print:max-w-none print:mx-0 print:grid-cols-1"
      : count === 2
        ? "grid-cols-1 sm:grid-cols-2 print:grid-cols-2"
        : count === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 print:grid-cols-4";

  return (
    <div
      className={`bg-white rounded-[1.5rem] shadow-[0_20px_50px_-28px_rgba(15,23,42,0.35)] ring-1 ring-stone-200/60 px-4 py-6 sm:p-8 md:p-10 print:shadow-none print:rounded-none print:ring-0 print:px-[5mm] print:py-[3mm] print:max-w-none print:bg-white`}
    >

      <header className="text-center mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-stone-200/80 print:mb-4 print:pb-3 print:border-stone-900/15 print:break-after-avoid">
        <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.2em] text-stone-400 font-medium mb-2 print:mb-1 print:text-[7pt] print:tracking-[0.18em] print:text-stone-500">
          {data.neighborhood} · {data.year}
        </p>
        <h1
          className={`text-2xl sm:text-3xl md:text-[2rem] font-bold text-stone-900 mb-2 tracking-tight print:text-[18pt] print:mb-1.5 print:leading-tight ${serif.className}`}
        >
          {data.title}
        </h1>
        <p className="text-stone-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed print:text-[9.5pt] print:max-w-[85%] print:text-stone-600 print:leading-snug">
          {data.subtitle}
        </p>
      </header>

      <div className={`grid gap-5 sm:gap-6 md:gap-7 print:gap-2.5 ${gridClass}`}>
        {data.categories.map((cat, index) => (
          <CategoryColumn key={cat.id} cat={cat} index={index} />
        ))}
      </div>

      <footer className="mt-8 sm:mt-10 pt-5 border-t border-stone-100 text-center text-[0.7rem] sm:text-xs text-stone-400 tracking-wide print:hidden">
        <span className="print:font-medium">{data.neighborhood}</span>
        <span className="print:text-stone-300 print:mx-1.5">·</span>
        <span>Community</span>
        <span className="print:text-stone-300 print:mx-1.5">·</span>
        <span>{data.year}</span>
      </footer>

    </div>
  );
}
