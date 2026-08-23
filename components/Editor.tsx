"use client";
import {
  CATEGORY_COLORS,
  categoryColorSwatch,
  makeBullet,
  makeCategory,
  makeSubCategory,
} from "@/lib/data";
import type { Category, InfographicData, SubCategory } from "@/lib/data";

interface Props {
  data: InfographicData;
  onChange: (data: InfographicData) => void;
}

export default function Editor({ data, onChange }: Props) {
  const set = (partial: Partial<InfographicData>) => onChange({ ...data, ...partial });

  const updateCategory = (catId: string, partial: Partial<Category>) => {
    onChange({
      ...data,
      categories: data.categories.map((c) => (c.id === catId ? { ...c, ...partial } : c)),
    });
  };

  const removeCategory = (catId: string) => {
    onChange({ ...data, categories: data.categories.filter((c) => c.id !== catId) });
  };

  const updateSub = (catId: string, subId: string, partial: Partial<SubCategory>) => {
    updateCategory(catId, {
      subcategories: data.categories
        .find((c) => c.id === catId)!
        .subcategories.map((s) => (s.id === subId ? { ...s, ...partial } : s)),
    });
  };

  const removeSub = (catId: string, subId: string) => {
    updateCategory(catId, {
      subcategories: data.categories.find((c) => c.id === catId)!.subcategories.filter((s) => s.id !== subId),
    });
  };

  const updateBullet = (catId: string, subId: string, bId: string, text: string) => {
    const cat = data.categories.find((c) => c.id === catId)!;
    const sub = cat.subcategories.find((s) => s.id === subId)!;
    updateSub(catId, subId, {
      bullets: sub.bullets.map((b) => (b.id === bId ? { ...b, text } : b)),
    });
  };

  const removeBullet = (catId: string, subId: string, bId: string) => {
    const cat = data.categories.find((c) => c.id === catId)!;
    const sub = cat.subcategories.find((s) => s.id === subId)!;
    updateSub(catId, subId, { bullets: sub.bullets.filter((b) => b.id !== bId) });
  };

  const inputCls = "w-full text-sm border border-stone-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-emerald-500 bg-white";
  const btnSm = "text-xs px-2 py-1 rounded border";

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">General</h2>
        <div className="space-y-2">
          {(["title", "subtitle", "neighborhood", "year"] as const).map((field) => (
            <div key={field}>
              <label className="text-xs text-stone-500 capitalize block mb-0.5">{field}</label>
              <input className={inputCls} value={data[field]} onChange={(e) => set({ [field]: e.target.value })} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">Categories</h2>
          <button
            type="button"
            onClick={() => onChange({ ...data, categories: [...data.categories, makeCategory()] })}
            className={`${btnSm} border-emerald-400 text-emerald-700 hover:bg-emerald-50`}
          >
            + Add
          </button>
        </div>

        <div className="space-y-5">
          {data.categories.map((cat) => (
            <div key={cat.id} className="border border-stone-200 rounded-lg p-3 space-y-3">
              {/* Category header */}
              <div className="flex gap-2 items-start">
                <input
                  className={`${inputCls} flex-1`}
                  value={cat.title}
                  onChange={(e) => updateCategory(cat.id, { title: e.target.value })}
                  placeholder="Category title"
                />
                <button type="button" onClick={() => removeCategory(cat.id)} className="text-stone-300 hover:text-red-400 text-lg leading-none mt-1">×</button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="text-xs text-stone-500 block mb-0.5">Tab label</label>
                  <input
                    className={inputCls}
                    value={cat.tabLabel ?? ""}
                    onChange={(e) => updateCategory(cat.id, { tabLabel: e.target.value })}
                    placeholder="Short label on column tab"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-0.5">Column description</label>
                  <input
                    className={inputCls}
                    value={cat.description ?? ""}
                    onChange={(e) => updateCategory(cat.id, { description: e.target.value })}
                    placeholder="Italic line under the title"
                  />
                </div>
              </div>

              {/* Color picker */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-stone-400 mr-1">Color:</span>
                {CATEGORY_COLORS.map((col) => (
                  <button
                    type="button"
                    key={col}
                    onClick={() => updateCategory(cat.id, { color: col })}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${
                      cat.color === col ? "border-stone-600 scale-110" : "border-transparent"
                    } ${categoryColorSwatch[col]}`}
                  />
                ))}
              </div>

              {/* Subcategories */}
              <div className="space-y-3 pl-2 border-l-2 border-stone-100">
                {cat.subcategories.map((sub) => (
                  <div key={sub.id} className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <input
                        className={`${inputCls} flex-1 font-medium`}
                        value={sub.name}
                        onChange={(e) => updateSub(cat.id, sub.id, { name: e.target.value })}
                        placeholder="Subcategory name"
                      />
                      <button type="button" onClick={() => removeSub(cat.id, sub.id)} className="text-stone-300 hover:text-red-400 text-lg leading-none">×</button>
                    </div>

                    {/* Bullets */}
                    <div className="space-y-1 pl-2">
                      {sub.bullets.map((b) => (
                        <div key={b.id} className="flex gap-1 items-center">
                          <span className="text-stone-300 text-sm">•</span>
                          <input
                            className={`${inputCls} flex-1`}
                            value={b.text}
                            onChange={(e) => updateBullet(cat.id, sub.id, b.id, e.target.value)}
                          />
                          <button type="button" onClick={() => removeBullet(cat.id, sub.id, b.id)} className="text-stone-300 hover:text-red-400 text-base leading-none">×</button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => updateSub(cat.id, sub.id, { bullets: [...sub.bullets, makeBullet()] })}
                        className={`${btnSm} border-stone-300 text-stone-500 hover:bg-stone-50 mt-1`}
                      >
                        + Bullet
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => updateCategory(cat.id, { subcategories: [...cat.subcategories, makeSubCategory()] })}
                  className={`${btnSm} border-stone-300 text-stone-500 hover:bg-stone-50`}
                >
                  + Subcategory
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
