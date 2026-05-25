"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Editor from "@/components/Editor";
import Infographic from "@/components/Infographic";
import { defaultData, InfographicData } from "@/lib/data";
import { parseInfographicFromSearch } from "@/lib/share-url";

function HomeContent() {
  const searchParams = useSearchParams();
  const dataFromUrl = useMemo(() => parseInfographicFromSearch(searchParams), [searchParams]);

  const [dataOverride, setDataOverride] = useState<InfographicData | null>(null);
  const data = dataOverride ?? dataFromUrl ?? defaultData;
  const setData = setDataOverride;

  const [editorOpen, setEditorOpen] = useState(true);

  const handlePrint = () => window.print();

  const handleShare = () => {
    const encoded = encodeURIComponent(JSON.stringify(data));
    const url = `${window.location.origin}?data=${encoded}`;
    navigator.clipboard.writeText(url).then(() => alert("Shareable link copied to clipboard!"));
  };

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-[#f6f4f1] print:min-h-0 print:h-auto print:bg-white">
      <header className="bg-white/90 backdrop-blur-sm border-b border-stone-200/80 px-4 sm:px-6 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex items-center min-w-0">
          <span className="font-semibold text-stone-800 text-sm tracking-wide truncate">
            Infographic Builder
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setEditorOpen(!editorOpen)}
            className="text-sm px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors"
          >
            {editorOpen ? "Hide Editor" : "Show Editor"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="text-sm px-3 py-1.5 rounded-lg border border-teal-600 text-teal-800 hover:bg-teal-50 transition-colors"
          >
            Share Link
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="text-sm px-4 py-1.5 rounded-lg bg-teal-700 text-white hover:bg-teal-800 transition-colors"
          >
            Print / PDF
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row print:overflow-visible print:block print:flex-none">
        {editorOpen && (
          <aside className="flex min-h-0 w-full shrink-0 flex-1 flex-col overflow-y-auto border-b border-stone-200 bg-white lg:h-full lg:max-w-[20rem] lg:flex-none lg:w-80 lg:border-b-0 lg:border-r print:hidden">
            <Editor data={data} onChange={setData} />
          </aside>
        )}
        <main className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 flex justify-center print:overflow-visible print:block print:w-full print:max-w-none print:p-0 print:m-0">
          <div className="w-full max-w-[1400px] print:max-w-none">
            <Infographic data={data} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f6f4f1] flex items-center justify-center text-stone-500 text-sm">
          Loading…
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
