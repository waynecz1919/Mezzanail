"use client";

import { Clock3, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useLanguage } from "@/components/providers";
import { serviceCategories, type ServiceCategoryId } from "@/lib/services";

const ui = {
  en: {
    search: "Search services", all: "All services", price: "Price", duration: "Duration", enquire: "Please enquire", upTo90: "Up to 90 mins", empty: "No services match your search.", included: "What’s Included", pricing: "Pricing note", aftercare: "Aftercare", addOn: "Add-on service", categories: "Service categories",
    pricingGuide: "Prices shown are based on the standard service. Final pricing may vary depending on nail condition, length, design complexity, removal requirements and selected add-ons. Your nail artist will confirm the final price before the service begins.",
    source: "Prices and listed durations are from the official Mezzanail Nail Studio price list supplied on 18 July 2026. Services without a listed duration take up to 90 minutes, as confirmed by the studio.",
  },
  zh: {
    search: "搜索服务", all: "全部服务", price: "价格", duration: "预计时间", enquire: "请咨询", upTo90: "最长90分钟", empty: "没有符合搜索条件的服务。", included: "服务包含", pricing: "价格说明", aftercare: "护理建议", addOn: "附加服务", categories: "服务分类",
    pricingGuide: "页面所列价格以标准服务为基础。最终价格可能根据指甲状况、长度、设计复杂度、卸甲需求及所选附加项目而调整。美甲师将在服务开始前与顾客确认最终价格。",
    source: "价格与已标注时长来自2026年7月18日提供的 Mezzanail Nail Studio 官方价目表；门店确认未标注时长的项目最长为90分钟。",
  },
  ms: {
    search: "Cari servis", all: "Semua servis", price: "Harga", duration: "Tempoh", enquire: "Sila tanya", upTo90: "Sehingga 90 minit", empty: "Tiada servis sepadan dengan carian.", included: "Apa yang Disertakan", pricing: "Nota harga", aftercare: "Penjagaan selepas servis", addOn: "Servis tambahan", categories: "Kategori servis",
    pricingGuide: "Harga yang dipaparkan adalah berdasarkan servis standard. Harga akhir mungkin berbeza mengikut keadaan dan panjang kuku, kerumitan reka bentuk, keperluan penanggalan serta servis tambahan yang dipilih. Juruteknik kuku anda akan mengesahkan harga akhir sebelum servis bermula.",
    source: "Harga dan tempoh yang disenaraikan adalah daripada senarai harga rasmi Mezzanail Nail Studio bertarikh 18 Julai 2026. Studio mengesahkan servis tanpa tempoh disenaraikan mengambil masa sehingga 90 minit.",
  },
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
      const haystack = `${service.name} ${service.shortDescription[locale]} ${service.included[locale].join(" ")}`.toLowerCase();
      return matchesCategory && haystack.includes(query.trim().toLowerCase());
    }),
  })).filter(group => group.services.length), [category, locale, query]);

  return <section className="services-catalog section surface">
    <div className="shell">
      <div className="service-tools">
        <label className="service-search"><Search size={19} aria-hidden="true"/><span className="sr-only">{t.search}</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t.search}/></label>
        <div className="service-filters" role="group" aria-label={t.categories}>
          <button onClick={() => setCategory("all")} className={category === "all" ? "is-active" : ""}>{t.all}</button>
          {serviceCategories.map(group => <button key={group.id} onClick={() => setCategory(group.id)} className={category === group.id ? "is-active" : ""}>{group.label[locale]}</button>)}
        </div>
      </div>

      <div className="mt-10 grid gap-14">
        {filtered.map(group => <section key={group.id} id={`service-${group.id}`} className="scroll-mt-36">
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-[var(--line)] pb-4"><h2 className="text-2xl font-semibold tracking-[-.03em] sm:text-3xl">{group.label[locale]}</h2><span className="numbers text-xs text-[var(--muted)]">{String(group.services.length).padStart(2,"0")}</span></div>
          <div className="grid gap-4 lg:grid-cols-2">{group.services.map(service => <article key={service.name} className="service-row">
            <div className="service-card-head">
              <div className="min-w-0"><h3>{service.name}</h3>{service.addOn && <span className="service-add-on">{t.addOn}</span>}<p className="service-description">{service.shortDescription[locale]}</p></div>
              <div className="service-facts">
                <div><span>{t.price}</span><strong>{service.price === "Please enquire" ? t.enquire : service.price}</strong></div>
                <div><span><Clock3 size={13} aria-hidden="true"/>{t.duration}</span><strong>{service.duration === "Please enquire" ? t.enquire : service.duration === "Up to 90 mins" ? t.upTo90 : service.duration}</strong></div>
              </div>
            </div>
            <div className="service-included">
              <h4>{t.included}</h4>
              <ul>{service.included[locale].map(item => <li key={item}>{item}</li>)}</ul>
            </div>
            {service.pricingNote && <p className="service-note"><strong>{t.pricing}</strong>{service.pricingNote[locale]}</p>}
            {service.aftercareNote && <p className="service-note service-aftercare"><strong>{t.aftercare}</strong>{service.aftercareNote[locale]}</p>}
          </article>)}</div>
        </section>)}
        {!filtered.length && <div className="card p-10 text-center text-sm text-[var(--muted)]">{t.empty}</div>}
      </div>
      <div className="service-price-guide">
        <p>{t.pricingGuide}</p>
        <small>{t.source}</small>
      </div>
    </div>
  </section>;
}
