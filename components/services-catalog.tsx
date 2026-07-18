"use client";

import { Clock3, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useLanguage } from "@/components/providers";
import { serviceCategories, type ServiceCategoryId } from "@/lib/services";

const ui = {
  en: { search: "Search services", all: "All services", price: "Price", duration: "Duration", enquire: "Please enquire", empty: "No services match your search.", source: "Prices and listed durations are from the official Mezzanail Nail Studio price list supplied on 18 July 2026. Unlisted durations are shown as Please enquire." },
  zh: { search: "搜索服务", all: "全部服务", price: "价格", duration: "预计时间", enquire: "请咨询", empty: "没有符合搜索条件的服务。", source: "价格与已标注时长来自2026年7月18日提供的 Mezzanail Nail Studio 官方价目表；未标注时长的项目显示为“请咨询”。" },
  ms: { search: "Cari servis", all: "Semua servis", price: "Harga", duration: "Tempoh", enquire: "Sila tanya", empty: "Tiada servis sepadan dengan carian.", source: "Harga dan tempoh yang disenaraikan adalah daripada senarai harga rasmi Mezzanail Nail Studio bertarikh 18 Julai 2026. Tempoh yang tidak disenaraikan dipaparkan sebagai Sila tanya." },
} as const;

export function ServicesCatalog() {
  const { locale } = useLanguage();
  const t = ui[locale];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ServiceCategoryId>("all");

  const filtered = useMemo(() => serviceCategories.map(group => ({
    ...group,
    services: group.services.filter(service => {
      const matchesCategory = category === "all" || group.id === category;
      const haystack = `${service.name} ${service.description[locale]}`.toLowerCase();
      return matchesCategory && haystack.includes(query.trim().toLowerCase());
    }),
  })).filter(group => group.services.length), [category, locale, query]);

  return <section className="services-catalog section surface">
    <div className="shell">
      <div className="service-tools">
        <label className="service-search"><Search size={19} aria-hidden="true"/><span className="sr-only">{t.search}</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t.search}/></label>
        <div className="service-filters" role="group" aria-label="Service categories">
          <button onClick={() => setCategory("all")} className={category === "all" ? "is-active" : ""}>{t.all}</button>
          {serviceCategories.map(group => <button key={group.id} onClick={() => setCategory(group.id)} className={category === group.id ? "is-active" : ""}>{group.label[locale]}</button>)}
        </div>
      </div>

      <div className="mt-10 grid gap-14">
        {filtered.map(group => <section key={group.id} id={`service-${group.id}`} className="scroll-mt-36">
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-[var(--line)] pb-4"><h2 className="text-2xl font-semibold tracking-[-.03em] sm:text-3xl">{group.label[locale]}</h2><span className="numbers text-xs text-[var(--muted)]">{String(group.services.length).padStart(2,"0")}</span></div>
          <div className="grid gap-3 lg:grid-cols-2">{group.services.map(service => <article key={service.name} className="service-row">
            <div className="min-w-0"><h3>{service.name}</h3><p>{service.description[locale]}</p></div>
            <div className="service-facts">
              <div><span>{t.price}</span><strong>{service.price === "Please enquire" ? t.enquire : service.price}</strong></div>
              <div><span><Clock3 size={13}/>{t.duration}</span><strong>{service.duration === "Please enquire" ? t.enquire : service.duration}</strong></div>
            </div>
          </article>)}</div>
        </section>)}
        {!filtered.length && <div className="card p-10 text-center text-sm text-[var(--muted)]">{t.empty}</div>}
      </div>
      <p className="mt-10 text-xs leading-6 text-[var(--muted)]">{t.source}</p>
    </div>
  </section>;
}
