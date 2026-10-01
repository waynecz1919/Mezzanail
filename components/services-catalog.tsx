"use client";

import { ChevronDown, Clock3, Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/providers";
import {
  serviceCategories,
  type ServiceCategoryId,
  type ServiceItem,
} from "@/lib/services";

const ui = {
  en: {
    search: "Search services", all: "All services", price: "Price", duration: "Duration", enquire: "Please enquire", varies: "Duration varies", empty: "No services match your search.", included: "What’s Included", pricing: "Pricing note", aftercare: "Aftercare", addOn: "Add-on service", categories: "Service categories", viewDetails: "View details", hideDetails: "Hide details", clear: "Clear search and filters", results: "services shown", dualPrice: "Where two prices are shown, the first applies to women and the second to men.",
    pricingGuide: "Prices shown are based on the standard service. Final pricing may vary depending on nail condition, length, design complexity, removal requirements and selected add-ons. Your nail artist will confirm the final price before the service begins.",
    source: "Prices updated July 2026. Where no duration is listed, please check with the studio when booking.",
  },
  zh: {
    search: "搜索服务", all: "全部服务", price: "价格", duration: "预计时间", enquire: "请咨询", varies: "时间视情况而定", empty: "没有符合搜索条件的服务。", included: "服务包含", pricing: "价格说明", aftercare: "护理建议", addOn: "附加服务", categories: "服务分类", viewDetails: "查看详情", hideDetails: "收起详情", clear: "清除搜索与筛选", results: "项服务", dualPrice: "如显示两个价格，前者适用于女性，后者适用于男性。",
    pricingGuide: "页面所列价格以标准服务为基础。最终价格可能根据指甲状况、长度、设计复杂度、卸甲需求及所选附加项目而调整。美甲师将在服务开始前与顾客确认最终价格。",
    source: "价格更新于2026年7月。若未列出服务时长，请在预约时向门店确认。",
  },
  ms: {
    search: "Cari servis", all: "Semua servis", price: "Harga", duration: "Tempoh", enquire: "Sila tanya", varies: "Tempoh berbeza", empty: "Tiada servis sepadan dengan carian.", included: "Apa yang Disertakan", pricing: "Nota harga", aftercare: "Penjagaan selepas servis", addOn: "Servis tambahan", categories: "Kategori servis", viewDetails: "Lihat butiran", hideDetails: "Tutup butiran", clear: "Kosongkan carian dan penapis", results: "servis dipaparkan", dualPrice: "Jika dua harga dipaparkan, harga pertama untuk wanita dan harga kedua untuk lelaki.",
    pricingGuide: "Harga yang dipaparkan adalah berdasarkan servis standard. Harga akhir mungkin berbeza mengikut keadaan dan panjang kuku, kerumitan reka bentuk, keperluan penanggalan serta servis tambahan yang dipilih. Juruteknik kuku anda akan mengesahkan harga akhir sebelum servis bermula.",
    source: "Harga dan tempoh yang dinyatakan secara khusus datang daripada senarai harga Mezzanail Nail Studio bertarikh 18 Julai 2026. Jika tiada tempoh yang boleh disahkan, tempoh ditandakan sebagai berbeza dan perlu disahkan dengan studio.",
  },
} as const;

function ServiceDetails({
  service,
  locale,
  labels,
}: {
  service: ServiceItem;
  locale: "en" | "zh" | "ms";
  labels: (typeof ui)["en"] | (typeof ui)["zh"] | (typeof ui)["ms"];
}) {
  const [open, setOpen] = useState(false);
  const generatedId = useId();
  const panelId = `service-details-${generatedId.replaceAll(":", "")}`;
  const showPricingNote =
    service.pricingNote && !service.price.includes(" / ");

  return (
    <div className="service-details">
      <button
        type="button"
        className="service-details-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? labels.hideDetails : labels.viewDetails}
        <ChevronDown aria-hidden="true" size={17} />
      </button>
      <div
        id={panelId}
        className="service-details-panel"
        hidden={!open}
      >
        <div className="service-included">
          <h4>{labels.included}</h4>
          <ul>{service.included[locale].map(item => <li key={item}>{item}</li>)}</ul>
        </div>
        {showPricingNote && <p className="service-note"><strong>{labels.pricing}</strong>{service.pricingNote?.[locale]}</p>}
        {service.aftercareNote && <p className="service-note service-aftercare"><strong>{labels.aftercare}</strong>{service.aftercareNote[locale]}</p>}
      </div>
    </div>
  );
}

export function ServicesCatalog() {
  const { locale } = useLanguage();
  const t = ui[locale];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ServiceCategoryId>("all");
  const urlStateReady = useRef(false);

  useEffect(() => {
    const readUrlState = () => {
      const parameters = new URLSearchParams(window.location.search);
      const requestedCategory = parameters.get("category");
      setQuery(parameters.get("q") ?? "");
      setCategory(
        requestedCategory &&
          serviceCategories.some((group) => group.id === requestedCategory)
          ? (requestedCategory as ServiceCategoryId)
          : "all",
      );
    };

    if (!urlStateReady.current) {
      urlStateReady.current = true;
      readUrlState();
      return;
    }

    const url = new URL(window.location.href);
    if (query.trim()) url.searchParams.set("q", query.trim());
    else url.searchParams.delete("q");
    if (category === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", category);
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, [category, query]);

  useEffect(() => {
    const restoreUrlState = () => {
      const parameters = new URLSearchParams(window.location.search);
      const requestedCategory = parameters.get("category");
      setQuery(parameters.get("q") ?? "");
      setCategory(
        requestedCategory &&
          serviceCategories.some((group) => group.id === requestedCategory)
          ? (requestedCategory as ServiceCategoryId)
          : "all",
      );
    };
    window.addEventListener("popstate", restoreUrlState);
    return () => window.removeEventListener("popstate", restoreUrlState);
  }, []);

  const filtered = useMemo(() => serviceCategories.map(group => ({
    ...group,
    services: group.services.filter(service => {
      const matchesCategory = category === "all" || group.id === category;
      const haystack = `${service.name} ${service.shortDescription[locale]} ${service.included[locale].join(" ")}`.toLowerCase();
      return matchesCategory && haystack.includes(query.trim().toLowerCase());
    }),
  })).filter(group => group.services.length), [category, locale, query]);
  const resultCount = filtered.reduce(
    (total, group) => total + group.services.length,
    0,
  );

  return <section className="services-catalog section surface">
    <div className="shell">
      <div className="service-tools">
        <label className="service-search"><Search size={19} aria-hidden="true"/><span className="sr-only">{t.search}</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t.search}/></label>
        <div className="service-filters" role="group" aria-label={t.categories}>
          <button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")} className={category === "all" ? "is-active" : ""}>{t.all}</button>
          {serviceCategories.map(group => <button type="button" aria-pressed={category === group.id} key={group.id} onClick={() => setCategory(group.id)} className={category === group.id ? "is-active" : ""}>{group.label[locale]}</button>)}
        </div>
        <p className="service-results" role="status" aria-live="polite">{resultCount} {t.results}</p>
      </div>

      <div className="mt-10 grid gap-14">
        {filtered.map(group => <section key={group.id} id={`service-${group.id}`} className="scroll-mt-36">
          <div className="service-category-heading"><div><h2>{group.label[locale]}</h2>{group.services.some(service => service.price.includes(" / ")) && <p>{t.dualPrice}</p>}</div><span className="numbers">{String(group.services.length).padStart(2,"0")}</span></div>
          <div className="grid gap-4 lg:grid-cols-2">{group.services.map(service => <article key={service.name} className="service-row">
            <div className="service-card-head">
              <div className="min-w-0"><span className="service-card-category">{group.label[locale]}</span><h3>{service.name}</h3>{service.addOn && <span className="service-add-on">{t.addOn}</span>}<p className="service-description">{service.shortDescription[locale]}</p></div>
              <div className="service-facts">
                <div><span>{t.price}</span><strong>{service.price === "Please enquire" ? t.enquire : service.price}</strong></div>
                <div><span><Clock3 size={13} aria-hidden="true"/>{t.duration}</span><strong>{service.duration === "Please enquire" ? t.enquire : service.duration === "Duration varies" ? t.varies : service.duration}</strong></div>
              </div>
            </div>
            <ServiceDetails service={service} locale={locale} labels={t} />
          </article>)}</div>
        </section>)}
        {!filtered.length && <div className="service-empty card"><p>{t.empty}</p><button type="button" className="btn btn-ghost" onClick={() => { setQuery(""); setCategory("all"); }}>{t.clear}</button></div>}
      </div>
      <div className="service-price-guide">
        <p>{t.pricingGuide}</p>
        <small>{t.source}</small>
      </div>
    </div>
  </section>;
}
