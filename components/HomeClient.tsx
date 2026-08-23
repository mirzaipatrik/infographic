"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import Editor from "@/components/Editor";
import Infographic from "@/components/Infographic";
import type { InfographicData } from "@/lib/data";
import { logout, saveInfographic } from "@/app/actions";

interface HomeClientProps {
  initialData: InfographicData;
  isAdmin: boolean;
}

export default function HomeClient({ initialData, isAdmin }: HomeClientProps) {
  const [data, setData] = useState<InfographicData>(initialData);
  const [editorOpen, setEditorOpen] = useState(isAdmin);
  const [saveMessage, setSaveMessage] = useState<{ type: "ok" | "error"; text: string } | null>(
    null,
  );
  const [saving, startSave] = useTransition();

  useEffect(() => {
    if (!saveMessage) return;
    const timer = window.setTimeout(() => setSaveMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [saveMessage]);

  const handlePrint = () => window.print();

  const handleSave = () => {
    setSaveMessage(null);
    startSave(async () => {
      const result = await saveInfographic(data);
      if (result.ok) {
        setSaveMessage({ type: "ok", text: "Saved." });
      } else {
        setSaveMessage({ type: "error", text: result.error });
      }
    });
  };

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-[#f6f4f1] print:min-h-0 print:h-auto print:bg-white">
      <header className="bg-white/90 backdrop-blur-sm border-b border-stone-200/80 px-4 sm:px-6 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex items-center min-w-0 gap-3">
          <span className="font-semibold text-stone-800 text-sm tracking-wide truncate">
            Infographic Builder
          </span>
          {saveMessage && (
            <span
              className={`text-sm shrink-0 ${
                saveMessage.type === "ok" ? "text-teal-700" : "text-rose-700"
              }`}
            >
              {saveMessage.text}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin ? (
            <>
              <button
                type="button"
                onClick={() => setEditorOpen(!editorOpen)}
                className="text-sm px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors"
              >
                {editorOpen ? "Hide Editor" : "Show Editor"}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="text-sm px-3 py-1.5 rounded-lg border border-teal-600 text-teal-800 hover:bg-teal-50 transition-colors disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="text-sm px-4 py-1.5 rounded-lg bg-teal-700 text-white hover:bg-teal-800 transition-colors"
              >
                Print / PDF
              </button>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handlePrint}
                className="text-sm px-4 py-1.5 rounded-lg bg-teal-700 text-white hover:bg-teal-800 transition-colors"
              >
                Print / PDF
              </button>
              <Link
                href="/login"
                className="text-sm px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors"
              >
                Admin login
              </Link>
            </>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row print:overflow-visible print:block print:flex-none">
        {isAdmin && editorOpen && (
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
