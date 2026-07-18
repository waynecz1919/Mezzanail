import type { Locale } from "@/lib/i18n";

export type ServiceCategoryId = "manicure" | "pedicure" | "callus" | "extensions" | "waxing" | "addons";

export type ServiceItem = {
  name: string;
  price: string;
  duration: string;
  description: Record<Locale, string>;
  addOn?: boolean;
};

export type ServiceCategory = {
  id: ServiceCategoryId;
  label: Record<Locale, string>;
  services: ServiceItem[];
};

const descriptions = {
  manicure: {
    en: "Professional manicure and hand care with a finish selected for this service.",
    zh: "专业手部与指甲护理，并按所选项目完成相应效果。",
    ms: "Manicure dan penjagaan tangan profesional dengan kemasan mengikut servis pilihan.",
  },
  pedicure: {
    en: "Professional pedicure and foot care with a finish selected for this service.",
    zh: "专业足部与趾甲护理，并按所选项目完成相应效果。",
    ms: "Pedicure dan penjagaan kaki profesional dengan kemasan mengikut servis pilihan.",
  },
  callus: {
    en: "Focused foot treatment for smoother, more comfortable skin.",
    zh: "针对足部粗糙与厚茧的专业护理，让肌肤更平滑舒适。",
    ms: "Rawatan kaki khusus untuk kulit yang lebih licin dan selesa.",
  },
  extension: {
    en: "Nail extension or enhancement service using the selected system.",
    zh: "使用所选系统进行美甲延伸、补甲或结构强化。",
    ms: "Servis sambungan atau pengukuhan kuku menggunakan sistem pilihan.",
  },
  waxing: {
    en: "Targeted waxing service for a smooth, clean finish.",
    zh: "指定部位蜜蜡脱毛，带来干净平滑的效果。",
    ms: "Servis waxing khusus untuk hasil yang licin dan kemas.",
  },
  addon: {
    en: "An additional nail service or upgrade. Confirm suitability with the studio.",
    zh: "附加美甲服务或升级项目，请向门店确认适用情况。",
    ms: "Servis tambahan atau naik taraf kuku. Sahkan kesesuaian dengan studio.",
  },
} satisfies Record<string, Record<Locale, string>>;

const enquire = "Please enquire";

export const serviceCategories: ServiceCategory[] = [
  {
    id: "manicure",
    label: { en: "Hand Care", zh: "手部护理", ms: "Penjagaan Tangan" },
    services: [
      { name: "Express Manicure", price: "RM20 / RM30", duration: "20 mins", description: descriptions.manicure },
      { name: "Basic Manicure", price: "RM35 / RM45", duration: "35 mins", description: descriptions.manicure },
      { name: "Classic Manicure", price: "RM55 / RM60", duration: "45 mins", description: descriptions.manicure },
      { name: "Spa Manicure", price: "RM138 / RM148", duration: "75 mins", description: descriptions.manicure },
      { name: "Gelish Manicure", price: "RM95", duration: "75 mins", description: descriptions.manicure },
      { name: "Gelish French Manicure", price: "RM125", duration: "75 mins", description: descriptions.manicure },
      { name: "Kid Manicure", price: "RM25", duration: "30 mins", description: descriptions.manicure },
      { name: "CUCCIO Butter Manicure", price: "RM55 / RM65", duration: "60 mins", description: descriptions.manicure },
      { name: "CUCCIO Polisher Manicure", price: "RM88 / RM98", duration: "75 mins", description: descriptions.manicure },
      { name: "CUCCIO Spa Manicure", price: "RM158 / RM168", duration: "75 mins", description: descriptions.manicure },
    ],
  },
  {
    id: "pedicure",
    label: { en: "Foot Care", zh: "足部护理", ms: "Penjagaan Kaki" },
    services: [
      { name: "Express Pedicure", price: "RM20 / RM30", duration: "20 mins", description: descriptions.pedicure },
      { name: "Basic Pedicure", price: "RM40 / RM50", duration: "35 mins", description: descriptions.pedicure },
      { name: "Classic Pedicure", price: "RM60 / RM70", duration: "45 mins", description: descriptions.pedicure },
      { name: "Spa Pedicure", price: "RM168 / RM178", duration: "75 mins", description: descriptions.pedicure },
      { name: "Gelish Pedicure", price: "RM120", duration: "75 mins", description: descriptions.pedicure },
      { name: "Gelish French Pedicure", price: "RM150", duration: "75 mins", description: descriptions.pedicure },
      { name: "Kid Pedicure", price: "RM35", duration: "30 mins", description: descriptions.pedicure },
      { name: "CUCCIO Butter Pedicure", price: "RM75 / RM85", duration: "60 mins", description: descriptions.pedicure },
      { name: "CUCCIO Polisher Pedicure", price: "RM98 / RM108", duration: "75 mins", description: descriptions.pedicure },
      { name: "CUCCIO Spa Pedicure", price: "RM188 / RM198", duration: "75 mins", description: descriptions.pedicure },
    ],
  },
  {
    id: "callus",
    label: { en: "Callus Removal", zh: "去茧护理", ms: "Rawatan Kulit Keras" },
    services: [
      { name: "FootLogix Treatment", price: "RM168 / RM178", duration: "90 mins", description: descriptions.callus },
      { name: "Callus Removal", price: "RM98 / RM108", duration: "60 mins", description: descriptions.callus },
    ],
  },
  {
    id: "extensions",
    label: { en: "Nail Extensions", zh: "美甲延伸", ms: "Sambungan Kuku" },
    services: [
      { name: "Acrylic Nail Extension", price: "RM280", duration: "90 mins", description: descriptions.extension },
      { name: "Gelish Nail Extension", price: "RM250", duration: "90 mins", description: descriptions.extension },
      { name: "Infill Nail Extension", price: "RM120", duration: enquire, description: descriptions.extension },
      { name: "Nail Tips Extension", price: "RM200", duration: enquire, description: descriptions.extension },
      { name: "Overlay Nails", price: "From RM45", duration: enquire, description: descriptions.extension },
      { name: "Nail Extension Removal", price: "From RM40", duration: enquire, description: descriptions.extension },
    ],
  },
  {
    id: "waxing",
    label: { en: "Waxing", zh: "蜜蜡脱毛", ms: "Waxing" },
    services: [
      { name: "Full Arms", price: "RM118", duration: "40 mins", description: descriptions.waxing },
      { name: "Half Arms (Upper)", price: "RM78", duration: "20 mins", description: descriptions.waxing },
      { name: "Half Arms (Lower)", price: "RM68", duration: "20 mins", description: descriptions.waxing },
      { name: "Back of Hand", price: "RM18", duration: "10 mins", description: descriptions.waxing },
      { name: "Fingers", price: "RM13", duration: "10 mins", description: descriptions.waxing },
      { name: "Full Leg", price: "RM158", duration: "40 mins", description: descriptions.waxing },
      { name: "Half Leg (Upper)", price: "RM98", duration: "20 mins", description: descriptions.waxing },
      { name: "Half Leg (Lower)", price: "RM88", duration: "20 mins", description: descriptions.waxing },
      { name: "Top of Foot", price: "RM18", duration: "10 mins", description: descriptions.waxing },
      { name: "Toes", price: "RM18", duration: "10 mins", description: descriptions.waxing },
    ],
  },
  {
    id: "addons",
    label: { en: "Additional Services", zh: "附加服务", ms: "Servis Tambahan" },
    services: [
      { name: "KVO Ingrow Band", price: "RM180", duration: "75 mins", description: descriptions.addon, addOn: true },
      { name: "Gel Color", price: "RM60", duration: enquire, description: descriptions.addon, addOn: true },
      { name: "Nail Repair", price: "From RM8", duration: enquire, description: descriptions.addon, addOn: true },
      { name: "Cut Nails", price: "RM10 / RM20", duration: enquire, description: descriptions.addon, addOn: true },
      { name: "Gel French", price: "RM30", duration: enquire, description: descriptions.addon, addOn: true },
      { name: "Acrylic French", price: "RM25", duration: enquire, description: descriptions.addon, addOn: true },
      { name: "Nail Art", price: "From RM8", duration: enquire, description: descriptions.addon, addOn: true },
      { name: "Ingrow Nail", price: "From RM20", duration: enquire, description: descriptions.addon, addOn: true },
      { name: "Gel Soak Off Removal", price: "From RM25", duration: enquire, description: descriptions.addon, addOn: true },
    ],
  },
];

export const serviceSource = {
  name: "Mezzanail Nail Studio printed price list",
  verifiedOn: "2026-07-18",
  note: "Prices and listed durations were transcribed from the official studio price list supplied on 18 July 2026. Where no duration was printed, the site displays Please enquire.",
};
