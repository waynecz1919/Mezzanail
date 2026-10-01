import type { Locale } from "@/lib/i18n";

export type ServiceCategoryId = "manicure" | "pedicure" | "callus" | "extensions" | "waxing" | "addons";

type LocalizedText = Record<Locale, string>;
type LocalizedList = Record<Locale, string[]>;

export type ServiceItem = {
  name: string;
  price: string;
  duration: string;
  shortDescription: LocalizedText;
  included: LocalizedList;
  pricingNote?: LocalizedText;
  aftercareNote?: LocalizedText;
  addOn?: boolean;
};

export type ServiceCategory = {
  id: ServiceCategoryId;
  label: LocalizedText;
  services: ServiceItem[];
};

type ServiceContent = Pick<ServiceItem, "shortDescription" | "included" | "pricingNote" | "aftercareNote">;

const text = (en: string, zh: string, ms: string): LocalizedText => ({ en, zh, ms });
const list = (en: string[], zh: string[], ms: string[]): LocalizedList => ({ en, zh, ms });

const confirmPrice = text(
  "The first price applies to women; the second price applies to men.",
  "前者为女生价格，后者为男生价格。",
  "Harga pertama untuk wanita; harga kedua untuk lelaki.",
);

const handCare = (shortDescription: LocalizedText, focus: LocalizedText, pricingNote?: LocalizedText, brandOnly = false): ServiceContent => ({
  shortDescription,
  included: brandOnly ? list([focus.en], [focus.zh], [focus.ms]) : list(
    ["Manicure preparation", focus.en, "Service-appropriate finishing"],
    ["美甲前准备", focus.zh, "按所选项目完成护理"],
    ["Persediaan manicure", focus.ms, "Kemasan mengikut servis"],
  ),
  pricingNote,
});

const footCare = (shortDescription: LocalizedText, focus: LocalizedText, pricingNote?: LocalizedText, brandOnly = false): ServiceContent => ({
  shortDescription,
  included: brandOnly ? list([focus.en], [focus.zh], [focus.ms]) : list(
    ["Pedicure preparation", focus.en, "Service-appropriate finishing"],
    ["美足前准备", focus.zh, "按所选项目完成护理"],
    ["Persediaan pedicure", focus.ms, "Kemasan mengikut servis"],
  ),
  pricingNote,
});

const waxing = (shortDescription: LocalizedText, area: LocalizedText): ServiceContent => ({
  shortDescription,
  included: list(
    [`Waxing for ${area.en}`, "Service-area finishing"],
    [`${area.zh}蜜蜡脱毛`, "服务部位整理"],
    [`Waxing untuk ${area.ms}`, "Kemasan kawasan servis"],
  ),
  aftercareNote: text(
    "Follow the studio’s post-wax guidance and avoid irritating the treated area immediately after your appointment.",
    "请遵循门店的脱毛后护理建议，并避免在服务后立即刺激护理部位。",
    "Ikuti panduan selepas waxing daripada studio dan elakkan iritasi pada kawasan rawatan sejurus selepas servis.",
  ),
});

const service = (name: string, price: string, duration: string, content: ServiceContent, addOn = false): ServiceItem => ({
  name,
  price,
  duration,
  ...content,
  ...(addOn ? { addOn: true } : {}),
});

const enquire = "Duration varies";

export const serviceCategories: ServiceCategory[] = [
  {
    id: "manicure",
    label: text("Hand Care", "手部护理", "Penjagaan Tangan"),
    services: [
      service("Express Manicure", "RM20 / RM30", "20 mins", handCare(
        text("A time-efficient manicure for neat, well-groomed nails when you want polished essentials without an extended treatment.", "适合时间有限时选择的快速美甲，让指甲呈现整洁利落的基础效果。", "Manicure pantas untuk kuku yang kemas apabila anda mahukan penjagaan asas tanpa rawatan yang panjang."),
        text("Express manicure finish", "快速美甲效果", "Kemasan manicure ekspres"), confirmPrice,
      )),
      service("Basic Manicure", "RM35 / RM45", "35 mins", handCare(
        text("An essential manicure that refreshes the appearance of natural nails with clean, considered grooming and finishing.", "基础手部美甲护理，改善自然指甲的整洁度，并完成细致利落的修护效果。", "Manicure asas yang menyegarkan penampilan kuku semula jadi dengan penjagaan dan kemasan yang kemas."),
        text("Basic manicure care", "基础美甲护理", "Penjagaan manicure asas"), confirmPrice,
      )),
      service("Classic Manicure", "RM55 / RM60", "45 mins", handCare(
        text("A complete classic manicure for clients seeking refined nail grooming and a carefully finished, polished appearance.", "完整的经典美甲护理，适合希望获得精致修护与细腻完成效果的顾客。", "Manicure klasik lengkap untuk pelanggan yang mahukan penjagaan kuku halus dan kemasan yang teliti."),
        text("Classic manicure care", "经典美甲护理", "Penjagaan manicure klasik"), confirmPrice,
      )),
      service("Spa Manicure", "RM138 / RM148", "75 mins", handCare(
        text("An extended spa manicure designed for a more considered hand-care experience and an impeccably groomed finish.", "延长版水疗美甲护理，适合希望享受更完整手部护理与精致效果的顾客。", "Manicure spa lanjutan untuk pengalaman penjagaan tangan yang lebih menyeluruh dan kemasan rapi."),
        text("Spa manicure treatment", "水疗美甲护理", "Rawatan manicure spa"), confirmPrice,
      )),
      service("Gelish Manicure", "RM95", "75 mins", handCare(
        text("A Gelish manicure with a single-colour finish for glossy, refined nails and longer-wearing colour.", "单色 Gelish 凝胶美甲，打造光泽细腻且更持久的美甲效果。", "Manicure Gelish dengan kemasan satu warna untuk kuku berkilat, kemas dan warna yang lebih tahan lama."),
        text("Single-colour Gelish application", "单色 Gelish 凝胶上色", "Aplikasi Gelish satu warna"),
      )),
      service("Gelish French Manicure", "RM125", "75 mins", handCare(
        text("A Gelish manicure finished with a clean French style for an elegant, balanced and enduring look.", "Gelish 凝胶法式美甲，以干净利落的法式线条呈现优雅持久的效果。", "Manicure Gelish dengan kemasan French yang bersih untuk gaya elegan, seimbang dan tahan lama."),
        text("Gelish French finish", "Gelish 凝胶法式效果", "Kemasan French Gelish"),
      )),
      service("Kid Manicure", "RM25", "30 mins", handCare(
        text("A simple manicure service created for younger clients who want tidy nails and a light, age-appropriate finish.", "为儿童顾客设计的简洁美甲服务，带来整齐且适龄的轻巧效果。", "Servis manicure ringkas untuk pelanggan muda yang mahukan kuku kemas dan kemasan sesuai usia."),
        text("Age-appropriate manicure care", "适龄美甲护理", "Penjagaan manicure sesuai usia"),
      )),
      service("CUCCIO Butter Manicure", "RM55 / RM65", "60 mins", handCare(
        text("A deeply hydrating manicure using CUCCIO’s rich whipped butter, which melts into the skin for long-lasting moisture without a greasy after-feel.", "使用 CUCCIO 丰润的打发质地 Butter 深层滋润双手，带来持久保湿而不留油腻感。", "Manicure penghidratan mendalam menggunakan CUCCIO whipped butter untuk kelembapan tahan lama tanpa rasa berminyak."),
        text("Professional CUCCIO nail-care products", "CUCCIO 专业美甲护理产品", "Produk penjagaan kuku profesional CUCCIO"), confirmPrice, true,
      )),
      service("CUCCIO Polisher Manicure", "RM88 / RM98", "75 mins", handCare(
        text("A gentle exfoliating manicure using CUCCIO’s creamy polisher with sugarcane, walnut and jojoba extracts to remove dull surface skin and leave hands feeling smoother.", "使用含甘蔗、核桃与荷荷巴萃取的 CUCCIO 柔和乳霜磨砂进行手部去角质，让肌肤触感更平滑。", "Manicure eksfoliasi lembut menggunakan CUCCIO creamy polisher dengan ekstrak tebu, walnut dan jojoba untuk membantu kulit tangan terasa lebih licin."),
        text("Professional CUCCIO nail-care products", "CUCCIO 专业美甲护理产品", "Produk penjagaan kuku profesional CUCCIO"), confirmPrice, true,
      )),
      service("CUCCIO Spa Manicure", "RM158 / RM168", "75 mins", handCare(
        text("A complete hand-care ritual combining exfoliation, intensive hydration and cuticle care using CUCCIO spa products to leave hands feeling smooth, soft and refreshed.", "使用 CUCCIO Spa 产品进行完整手部护理，结合去角质、深层保湿与甘皮护理，让双手更柔滑清爽。", "Ritual penjagaan tangan lengkap menggunakan produk CUCCIO Spa, menggabungkan eksfoliasi, penghidratan intensif dan penjagaan kutikel untuk tangan yang lebih halus, lembut dan segar."),
        text("Professional CUCCIO nail-care products", "CUCCIO 专业美甲护理产品", "Produk penjagaan kuku profesional CUCCIO"), confirmPrice, true,
      )),
    ],
  },
  {
    id: "pedicure",
    label: text("Foot Care", "足部护理", "Penjagaan Kaki"),
    services: [
      service("Express Pedicure", "RM20 / RM30", "20 mins", footCare(
        text("A time-efficient pedicure for tidy, refreshed toenails when you need neat essentials in a shorter appointment.", "适合时间有限时选择的快速美足，让趾甲呈现整洁清爽的基础效果。", "Pedicure pantas untuk kuku kaki yang kemas dan segar dalam janji temu yang lebih singkat."),
        text("Express pedicure finish", "快速美足效果", "Kemasan pedicure ekspres"), confirmPrice,
      )),
      service("Basic Pedicure", "RM40 / RM50", "35 mins", footCare(
        text("An essential pedicure that refreshes the appearance of natural toenails with clean, considered grooming and finishing.", "基础足部美甲护理，改善自然趾甲的整洁度，并完成细致清爽的效果。", "Pedicure asas yang menyegarkan penampilan kuku kaki semula jadi dengan penjagaan dan kemasan yang kemas."),
        text("Basic pedicure care", "基础美足护理", "Penjagaan pedicure asas"), confirmPrice,
      )),
      service("Classic Pedicure", "RM60 / RM70", "45 mins", footCare(
        text("A complete classic pedicure for clients seeking refined toenail grooming and a carefully finished appearance.", "完整的经典美足护理，适合希望获得精致趾甲修护与细腻效果的顾客。", "Pedicure klasik lengkap untuk pelanggan yang mahukan penjagaan kuku kaki halus dan kemasan yang teliti."),
        text("Classic pedicure care", "经典美足护理", "Penjagaan pedicure klasik"), confirmPrice,
      )),
      service("Spa Pedicure", "RM168 / RM178", "75 mins", footCare(
        text("An extended spa pedicure created for a more considered foot-care experience and an impeccably groomed finish.", "延长版水疗美足护理，适合希望享受更完整足部护理与精致效果的顾客。", "Pedicure spa lanjutan untuk pengalaman penjagaan kaki yang lebih menyeluruh dan kemasan rapi."),
        text("Spa pedicure treatment", "水疗美足护理", "Rawatan pedicure spa"), confirmPrice,
      )),
      service("Gelish Pedicure", "RM120", "75 mins", footCare(
        text("A Gelish pedicure with a single-colour finish for glossy, refined toenails and longer-wearing colour.", "单色 Gelish 凝胶美足，打造光泽细腻且更持久的趾甲效果。", "Pedicure Gelish satu warna untuk kuku kaki berkilat, kemas dan warna yang lebih tahan lama."),
        text("Single-colour Gelish application", "单色 Gelish 凝胶上色", "Aplikasi Gelish satu warna"),
      )),
      service("Gelish French Pedicure", "RM150", "75 mins", footCare(
        text("A Gelish pedicure finished with a clean French style for elegant, balanced and enduring toenails.", "Gelish 凝胶法式美足，以干净利落的法式线条呈现优雅持久的效果。", "Pedicure Gelish dengan kemasan French yang bersih untuk kuku kaki elegan, seimbang dan tahan lama."),
        text("Gelish French finish", "Gelish 凝胶法式效果", "Kemasan French Gelish"),
      )),
      service("Kid Pedicure", "RM35", "30 mins", footCare(
        text("A simple pedicure service for younger clients who want tidy toenails and a light, age-appropriate finish.", "为儿童顾客设计的简洁美足服务，带来整齐且适龄的轻巧效果。", "Servis pedicure ringkas untuk pelanggan muda yang mahukan kuku kaki kemas dan kemasan sesuai usia."),
        text("Age-appropriate pedicure care", "适龄美足护理", "Penjagaan pedicure sesuai usia"),
      )),
      service("CUCCIO Butter Pedicure", "RM75 / RM85", "60 mins", footCare(
        text("A deeply hydrating pedicure using CUCCIO’s rich whipped butter to soften and moisturise dry skin on the feet without leaving a greasy after-feel.", "使用 CUCCIO 丰润的打发质地 Butter 滋润双足，帮助柔软并保湿干燥肌肤，同时不留油腻感。", "Pedicure penghidratan mendalam menggunakan CUCCIO whipped butter untuk melembut dan melembapkan kulit kaki yang kering tanpa rasa berminyak."),
        text("Professional CUCCIO nail-care products", "CUCCIO 专业美甲护理产品", "Produk penjagaan kuku profesional CUCCIO"), confirmPrice, true,
      )),
      service("CUCCIO Polisher Pedicure", "RM98 / RM108", "75 mins", footCare(
        text("A gentle exfoliating pedicure using CUCCIO’s creamy polisher with sugarcane, walnut and jojoba extracts to smooth and refresh the skin on the feet.", "使用含甘蔗、核桃与荷荷巴萃取的 CUCCIO 柔和乳霜磨砂进行足部去角质，让双足肌肤更平滑清爽。", "Pedicure eksfoliasi lembut menggunakan CUCCIO creamy polisher dengan ekstrak tebu, walnut dan jojoba untuk melicinkan dan menyegarkan kulit kaki."),
        text("Professional CUCCIO nail-care products", "CUCCIO 专业美甲护理产品", "Produk penjagaan kuku profesional CUCCIO"), confirmPrice, true,
      )),
      service("CUCCIO Spa Pedicure", "RM188 / RM198", "75 mins", footCare(
        text("A complete foot-care ritual combining exfoliation, intensive hydration, cuticle care and targeted heel care using CUCCIO spa products to leave feet feeling smoother, softer and refreshed.", "使用 CUCCIO Spa 产品进行完整足部护理，结合去角质、深层保湿、甘皮护理与针对性足跟护理，让双足更平滑柔软清爽。", "Ritual penjagaan kaki lengkap menggunakan produk CUCCIO Spa, menggabungkan eksfoliasi, penghidratan intensif, penjagaan kutikel dan penjagaan tumit khusus untuk kaki yang lebih licin, lembut dan segar."),
        text("Professional CUCCIO nail-care products", "CUCCIO 专业美甲护理产品", "Produk penjagaan kuku profesional CUCCIO"), confirmPrice, true,
      )),
    ],
  },
  {
    id: "callus",
    label: text("Callus Removal", "去茧护理", "Rawatan Kulit Keras"),
    services: [
      service("Footlogix Treatment", "RM168 / RM178", "90 mins", {
        shortDescription: text("A professional callus and foot-skin treatment using Footlogix foot-care products for smoother, more comfortable feet.", "使用 Footlogix 足部护理产品进行专业去茧与足部肌肤护理，让双足更平滑舒适。", "Rawatan profesional untuk kulit keras dan kulit kaki menggunakan produk penjagaan kaki Footlogix bagi kaki yang lebih licin dan selesa."),
        included: list(["Professional Footlogix nail-care products"], ["Footlogix 专业美甲护理产品"], ["Produk penjagaan kuku profesional Footlogix"]),
        pricingNote: confirmPrice,
      }),
      service("Callus Removal", "RM98 / RM108", "60 mins", {
        shortDescription: text("A targeted service for visible callus build-up, helping feet feel smoother, tidier and more comfortable.", "针对明显厚茧的足部护理，帮助双足恢复更平滑、整洁与舒适的状态。", "Servis khusus untuk pembentukan kulit keras yang ketara, membantu kaki terasa lebih licin, kemas dan selesa."),
        included: list(["Targeted callus care", "Service-appropriate finishing"], ["针对性去茧护理", "按项目完成护理"], ["Penjagaan kulit keras khusus", "Kemasan mengikut servis"]),
        pricingNote: confirmPrice,
        aftercareNote: text("Follow the studio’s home-care guidance to help maintain smoother-feeling feet after your appointment.", "请遵循门店提供的居家护理建议，以帮助维持足部平滑舒适。", "Ikuti panduan penjagaan di rumah daripada studio untuk membantu mengekalkan kaki yang lebih licin selepas servis."),
      }),
    ],
  },
  {
    id: "extensions",
    label: text("Nail Extensions", "美甲延展", "Sambungan Kuku"),
    services: [
      service("Acrylic Nail Extension", "RM280", "90 mins", {
        shortDescription: text("A structured acrylic extension service for added length, balanced shape and a polished, durable nail silhouette.", "使用水晶系统增加长度并调整结构与形状，打造利落耐看的延展甲效果。", "Servis sambungan akrilik berstruktur untuk menambah panjang, bentuk seimbang dan siluet kuku yang tahan serta kemas."),
        included: list(["Acrylic extension application", "Length and shape refinement", "Basic colour", "Extension finishing"], ["水晶延展甲制作", "长度与甲型调整", "基本颜色", "延展甲完成处理"], ["Aplikasi sambungan akrilik", "Pelarasan panjang dan bentuk", "Warna asas", "Kemasan sambungan"]),
        pricingNote: text("Final pricing varies by nail length and shape. Basic colour is included; nail art and additional design work are charged separately.", "最终价格会根据指甲长度及造型调整。价格包含基本颜色；美甲彩绘及额外设计需另行收费。", "Harga akhir berbeza mengikut panjang dan bentuk kuku. Warna asas disertakan; seni kuku dan reka bentuk tambahan dikenakan caj berasingan."),
        aftercareNote: text("Avoid using extensions as tools and return to the studio for professional maintenance or removal.", "请避免用延展甲撬取物品，并回店进行专业补甲或卸甲。", "Elakkan menggunakan sambungan sebagai alat dan kembali ke studio untuk penyelenggaraan atau penanggalan profesional."),
      }),
      service("Gelish Nail Extension", "RM250", "90 mins", {
        shortDescription: text("A Gelish extension service for elegant added length, balanced structure and a smooth, refined nail finish.", "使用 Gelish 系统增加优雅长度并调整结构，呈现平滑细致的延展甲效果。", "Servis sambungan Gelish untuk panjang elegan, struktur seimbang dan kemasan kuku yang licin serta halus."),
        included: list(["Gelish extension application", "Length and shape refinement", "Basic colour", "Extension finishing"], ["Gelish 延展甲制作", "长度与甲型调整", "基本颜色", "延展甲完成处理"], ["Aplikasi sambungan Gelish", "Pelarasan panjang dan bentuk", "Warna asas", "Kemasan sambungan"]),
        pricingNote: text("Final pricing varies by nail length and shape. Basic colour is included; nail art and additional design work are charged separately.", "最终价格会根据指甲长度及造型调整。价格包含基本颜色；美甲彩绘及额外设计需另行收费。", "Harga akhir berbeza mengikut panjang dan bentuk kuku. Warna asas disertakan; seni kuku dan reka bentuk tambahan dikenakan caj berasingan."),
        aftercareNote: text("Avoid using extensions as tools and return to the studio for professional maintenance or removal.", "请避免用延展甲撬取物品，并回店进行专业补甲或卸甲。", "Elakkan menggunakan sambungan sebagai alat dan kembali ke studio untuk penyelenggaraan atau penanggalan profesional."),
      }),
      service("Infill Nail Extension", "RM120", enquire, {
        shortDescription: text("A maintenance service that refreshes existing nail extensions by addressing visible regrowth and restoring a balanced appearance.", "针对现有延展甲生长空隙进行维护，帮助恢复均衡结构与整洁外观。", "Servis penyelenggaraan sambungan kuku untuk menangani pertumbuhan semula dan memulihkan penampilan yang seimbang."),
        included: list(["Extension condition check", "Infill application", "Shape refinement", "Basic colour", "Extension finishing"], ["延展甲状况检查", "补甲处理", "甲型调整", "基本颜色", "延展甲完成处理"], ["Pemeriksaan keadaan sambungan", "Aplikasi infill", "Pelarasan bentuk", "Warna asas", "Kemasan sambungan"]),
        pricingNote: text("Final pricing varies by nail length, shape and repair requirements. Basic colour is included; nail art is charged separately.", "最终价格会根据指甲长度、造型及修补需求调整。价格包含基本颜色；美甲彩绘需另行收费。", "Harga akhir berbeza mengikut panjang, bentuk dan keperluan pembaikan. Warna asas disertakan; seni kuku dikenakan caj berasingan."),
        aftercareNote: text("Avoid using extensions as tools and arrange professional maintenance when regrowth becomes visible.", "请避免用延展甲撬取物品，并在生长空隙明显时安排专业维护。", "Elakkan menggunakan sambungan sebagai alat dan aturkan penyelenggaraan profesional apabila pertumbuhan semula kelihatan."),
      }),
      service("Nail Tips Extension", "RM200", enquire, {
        shortDescription: text("A nail-tip extension service for added length and a clean, balanced shape tailored to your preferred look.", "以贴片方式增加指甲长度，并根据喜好调整出干净均衡的甲型。", "Servis sambungan tip kuku untuk menambah panjang dan bentuk bersih serta seimbang mengikut gaya pilihan."),
        included: list(["Nail-tip application", "Length and shape refinement", "Basic colour", "Extension finishing"], ["贴片延展制作", "长度与甲型调整", "基本颜色", "延展甲完成处理"], ["Aplikasi tip kuku", "Pelarasan panjang dan bentuk", "Warna asas", "Kemasan sambungan"]),
        pricingNote: text("Final pricing varies by nail length and shape. Basic colour is included; nail art and additional design work are charged separately.", "最终价格会根据指甲长度及造型调整。价格包含基本颜色；美甲彩绘及额外设计需另行收费。", "Harga akhir berbeza mengikut panjang dan bentuk kuku. Warna asas disertakan; seni kuku dan reka bentuk tambahan dikenakan caj berasingan."),
        aftercareNote: text("Avoid using extensions as tools and return to the studio for professional maintenance or removal.", "请避免用延展甲撬取物品，并回店进行专业补甲或卸甲。", "Elakkan menggunakan sambungan sebagai alat dan kembali ke studio untuk penyelenggaraan atau penanggalan profesional."),
      }),
      service("Overlay Nails", "From RM45", enquire, {
        shortDescription: text("A natural-nail overlay that adds supportive structure while preserving your existing nail length and overall shape.", "在自然甲面增加支撑结构，同时保留现有指甲长度与整体甲型。", "Lapisan pada kuku semula jadi yang menambah sokongan sambil mengekalkan panjang dan bentuk kuku sedia ada."),
        included: list(["Nail condition check", "Overlay application", "Shape refinement", "Basic colour", "Overlay finishing"], ["指甲状况检查", "本甲加固处理", "甲型调整", "基本颜色", "加固完成处理"], ["Pemeriksaan keadaan kuku", "Aplikasi overlay", "Pelarasan bentuk", "Warna asas", "Kemasan overlay"]),
        pricingNote: text("Starting price applies. Final pricing varies by nail length and shape. Basic colour is included; nail art is charged separately.", "页面显示为起价，最终价格会根据指甲长度及造型调整。价格包含基本颜色；美甲彩绘需另行收费。", "Harga permulaan terpakai. Harga akhir berbeza mengikut panjang dan bentuk kuku. Warna asas disertakan; seni kuku dikenakan caj berasingan."),
      }),
      service("Nail Extension Removal", "From RM40", enquire, {
        shortDescription: text("Professional removal of existing nail extensions with the method selected according to the extension system and condition.", "根据现有延展甲的系统与状况，采用相应方式进行专业卸除。", "Penanggalan profesional sambungan kuku sedia ada dengan kaedah mengikut sistem dan keadaan sambungan."),
        included: list(["Extension condition check", "Professional extension removal", "Post-removal nail check"], ["延展甲状况检查", "专业延展甲卸除", "卸除后指甲检查"], ["Pemeriksaan keadaan sambungan", "Penanggalan sambungan profesional", "Pemeriksaan kuku selepas penanggalan"]),
        pricingNote: text("Starting price applies. Final pricing depends on the extension system, length, condition and removal complexity.", "页面显示为起价，最终价格将根据延展系统、长度、甲况与卸除难度调整。", "Harga permulaan terpakai. Harga akhir bergantung pada sistem, panjang, keadaan dan kerumitan penanggalan."),
        aftercareNote: text("Follow the nail artist’s care guidance after removal and avoid peeling or forcing remaining product from the nail.", "卸甲后请遵循美甲师的护理建议，勿自行撕除或强行剥离残留产品。", "Ikuti panduan penjagaan selepas penanggalan dan elakkan mengopek atau memaksa baki produk daripada kuku."),
      }),
    ],
  },
  {
    id: "waxing",
    label: text("Waxing", "蜜蜡脱毛", "Waxing"),
    services: [
      service("Full Arms", "RM118", "40 mins", waxing(text("Full-arm waxing for clients seeking a smooth, clean finish from the upper arm through the forearm.", "全手臂蜜蜡脱毛，适合希望上臂至前臂获得平滑洁净效果的顾客。", "Waxing seluruh lengan untuk hasil licin dan bersih dari bahagian atas hingga lengan bawah."), text("the full arms", "全手臂", "seluruh lengan"))),
      service("Half Arms (Upper)", "RM78", "20 mins", waxing(text("Upper half-arm waxing for a smooth, tidy finish across the selected upper-arm area.", "上半臂蜜蜡脱毛，让指定上臂区域呈现平滑整洁的效果。", "Waxing separuh lengan atas untuk hasil licin dan kemas pada kawasan lengan atas."), text("the upper half-arms", "上半臂", "separuh lengan atas"))),
      service("Half Arms (Lower)", "RM68", "20 mins", waxing(text("Lower half-arm waxing for a smooth, tidy finish across the selected forearm area.", "下半臂蜜蜡脱毛，让指定前臂区域呈现平滑整洁的效果。", "Waxing separuh lengan bawah untuk hasil licin dan kemas pada kawasan lengan bawah."), text("the lower half-arms", "下半臂", "separuh lengan bawah"))),
      service("Back of Hand", "RM18", "10 mins", waxing(text("Targeted waxing for the backs of the hands, leaving the visible area smooth and neatly finished.", "针对手背部位的蜜蜡脱毛，让可见区域呈现平滑整洁的效果。", "Waxing khusus untuk belakang tangan, meninggalkan kawasan yang kelihatan licin dan kemas."), text("the backs of the hands", "手背", "belakang tangan"))),
      service("Fingers", "RM13", "10 mins", waxing(text("Targeted finger waxing for a clean, smooth finish around this small and visible area.", "针对手指部位的蜜蜡脱毛，让细小且明显的区域更平滑整洁。", "Waxing jari secara khusus untuk hasil bersih dan licin pada kawasan kecil yang jelas kelihatan."), text("the fingers", "手指", "jari"))),
      service("Full Leg", "RM158", "40 mins", waxing(text("Full-leg waxing for clients seeking a smooth, even finish from the upper legs through the lower legs.", "全腿蜜蜡脱毛，适合希望大腿至小腿获得均匀平滑效果的顾客。", "Waxing seluruh kaki untuk hasil licin dan sekata dari bahagian atas hingga bawah kaki."), text("the full legs", "全腿", "seluruh kaki"))),
      service("Half Leg (Upper)", "RM98", "20 mins", waxing(text("Upper half-leg waxing for a smooth, clean finish across the selected thigh area.", "上半腿蜜蜡脱毛，让指定大腿区域呈现平滑洁净的效果。", "Waxing separuh kaki atas untuk hasil licin dan bersih pada kawasan paha."), text("the upper half-legs", "上半腿", "separuh kaki atas"))),
      service("Half Leg (Lower)", "RM88", "20 mins", waxing(text("Lower half-leg waxing for a smooth, clean finish across the selected lower-leg area.", "下半腿蜜蜡脱毛，让指定小腿区域呈现平滑洁净的效果。", "Waxing separuh kaki bawah untuk hasil licin dan bersih pada kawasan bawah kaki."), text("the lower half-legs", "下半腿", "separuh kaki bawah"))),
      service("Top of Foot", "RM18", "10 mins", waxing(text("Targeted waxing for the tops of the feet, leaving this visible area smooth and neatly finished.", "针对脚背部位的蜜蜡脱毛，让可见区域呈现平滑整洁的效果。", "Waxing khusus untuk bahagian atas kaki, meninggalkan kawasan yang kelihatan licin dan kemas."), text("the tops of the feet", "脚背", "bahagian atas kaki"))),
      service("Toes", "RM18", "10 mins", waxing(text("Targeted toe waxing for a clean, smooth finish around this small and visible area.", "针对脚趾部位的蜜蜡脱毛，让细小且明显的区域更平滑整洁。", "Waxing jari kaki secara khusus untuk hasil bersih dan licin pada kawasan kecil yang jelas kelihatan."), text("the toes", "脚趾", "jari kaki"))),
    ],
  },
  {
    id: "addons",
    label: text("Additional Services", "附加服务", "Servis Tambahan"),
    services: [
      service("KVO Ingrow Band", "RM180", "75 mins", {
        shortDescription: text("A focused KVO band service designed to support the appearance and management of an ingrown nail concern.", "针对嵌甲问题的 KVO 矫正带服务，帮助改善指甲生长与外观管理。", "Servis KVO band khusus untuk menyokong pengurusan dan penampilan masalah kuku cengkam."),
        included: list(["KVO band application", "Application check"], ["KVO 矫正带安装", "安装后检查"], ["Aplikasi KVO band", "Pemeriksaan aplikasi"]),
        aftercareNote: text("Follow the studio’s care and follow-up guidance. Seek medical advice if pain, swelling or infection is present.", "请遵循门店的护理与复查建议；如出现疼痛、肿胀或感染，请寻求医疗意见。", "Ikuti panduan penjagaan dan susulan studio. Dapatkan nasihat perubatan jika terdapat sakit, bengkak atau jangkitan."),
      }, true),
      service("Gel Color", "RM60", enquire, {
        shortDescription: text("A single-colour gel application add-on for clients who want a glossy, longer-wearing colour finish.", "单色凝胶上色附加服务，适合希望获得光泽且更持久色彩效果的顾客。", "Tambahan aplikasi gel satu warna untuk pelanggan yang mahukan warna berkilat dan lebih tahan lama."),
        included: list(["Colour selection", "Single-colour gel application", "Gel finishing"], ["颜色选择", "单色凝胶上色", "凝胶完成处理"], ["Pemilihan warna", "Aplikasi gel satu warna", "Kemasan gel"]),
        pricingNote: text("This is listed as an additional service. Confirm the required main service before booking.", "此项目列为附加服务，预约前请确认需要搭配的主要服务。", "Ini disenaraikan sebagai servis tambahan. Sahkan servis utama yang diperlukan sebelum tempahan."),
        aftercareNote: text("Avoid peeling gel product from the nail and return to the studio for professional removal.", "请勿自行撕除凝胶产品，并回店进行专业卸甲。", "Elakkan mengopek produk gel daripada kuku dan kembali ke studio untuk penanggalan profesional."),
      }, true),
      service("Nail Repair", "From RM8", enquire, {
        shortDescription: text("A targeted repair add-on for a damaged or compromised nail, assessed according to its condition and structure.", "针对受损或结构不稳指甲的局部修补附加服务，并根据实际甲况评估处理。", "Tambahan pembaikan khusus untuk kuku rosak atau lemah, dinilai mengikut keadaan dan strukturnya."),
        included: list(["Nail condition check", "Targeted nail repair", "Repair finishing"], ["指甲状况检查", "局部修补处理", "修补完成处理"], ["Pemeriksaan keadaan kuku", "Pembaikan kuku khusus", "Kemasan pembaikan"]),
        pricingNote: text("Starting price applies. Final pricing depends on the nail condition, repair method and extent of damage.", "页面显示为起价，最终价格将根据甲况、修补方式与受损程度调整。", "Harga permulaan terpakai. Harga akhir bergantung pada keadaan kuku, kaedah pembaikan dan tahap kerosakan."),
      }, true),
      service("Cut Nails", "RM10 / RM20", enquire, {
        shortDescription: text("A straightforward nail-cutting add-on for clients who need length reduced and a tidier natural nail edge.", "简单的剪甲附加服务，适合需要缩短长度并整理自然甲边缘的顾客。", "Tambahan potong kuku ringkas untuk mengurangkan panjang dan merapikan tepi kuku semula jadi."),
        included: list(["Nail cutting", "Edge tidy-up"], ["剪甲处理", "甲缘整理"], ["Potong kuku", "Kemasan tepi kuku"]),
        pricingNote: confirmPrice,
      }, true),
      service("Gel French", "RM30", enquire, {
        shortDescription: text("A French-style gel finish add-on for a clean, defined tip and an elegant, balanced appearance.", "法式凝胶效果附加服务，以清晰甲尖线条呈现干净优雅的整体效果。", "Tambahan kemasan gel gaya French untuk hujung kuku yang jelas serta penampilan elegan dan seimbang."),
        included: list(["French style selection", "Gel French application", "Gel finishing"], ["法式样式选择", "凝胶法式制作", "凝胶完成处理"], ["Pemilihan gaya French", "Aplikasi Gel French", "Kemasan gel"]),
        pricingNote: text("This is listed as an additional service and is charged separately from the main nail service.", "此项目列为附加服务，并与主要美甲服务分开收费。", "Ini disenaraikan sebagai servis tambahan dan dikenakan caj berasingan daripada servis kuku utama."),
      }, true),
      service("Acrylic French", "RM25", enquire, {
        shortDescription: text("A French-style acrylic finish add-on for defined tips and a clean, structured nail appearance.", "法式水晶效果附加服务，以清晰甲尖线条呈现干净且有结构感的效果。", "Tambahan kemasan akrilik gaya French untuk hujung jelas dan penampilan kuku yang bersih serta berstruktur."),
        included: list(["French style selection", "Acrylic French application", "Acrylic finishing"], ["法式样式选择", "水晶法式制作", "水晶完成处理"], ["Pemilihan gaya French", "Aplikasi Acrylic French", "Kemasan akrilik"]),
        pricingNote: text("This is listed as an additional service and is charged separately from the main nail service.", "此项目列为附加服务，并与主要美甲服务分开收费。", "Ini disenaraikan sebagai servis tambahan dan dikenakan caj berasingan daripada servis kuku utama."),
      }, true),
      service("Nail Art", "From RM8", enquire, {
        shortDescription: text("A custom nail-art add-on for clients who want personalised detail, accents or a more expressive finish.", "个性化美甲彩绘附加服务，适合希望加入细节、重点装饰或独特效果的顾客。", "Tambahan seni kuku tersuai untuk pelanggan yang mahukan perincian, aksen atau kemasan lebih ekspresif."),
        included: list(["Selected nail-art application", "Design finishing"], ["所选美甲彩绘制作", "设计完成处理"], ["Aplikasi seni kuku pilihan", "Kemasan reka bentuk"]),
        pricingNote: text("Starting price applies. Final pricing depends on design complexity, the number of nails and selected design elements.", "页面显示为起价，最终价格将根据设计复杂度、制作指甲数量与所选设计元素调整。", "Harga permulaan terpakai. Harga akhir bergantung pada kerumitan reka bentuk, bilangan kuku dan elemen reka bentuk pilihan."),
      }, true),
      service("Ingrow Nail", "From RM20", enquire, {
        shortDescription: text("A targeted add-on for an ingrown nail concern, assessed carefully according to the nail’s current condition.", "针对嵌甲问题的局部附加服务，并根据指甲当前状况进行谨慎评估与处理。", "Tambahan khusus untuk masalah kuku cengkam, dinilai dengan teliti mengikut keadaan kuku semasa."),
        included: list(["Targeted ingrown-nail care", "Post-service guidance"], ["针对性嵌甲护理", "服务后护理建议"], ["Penjagaan kuku cengkam khusus", "Panduan selepas servis"]),
        pricingNote: text("Starting price applies. Final pricing depends on the nail condition and required service scope.", "页面显示为起价，最终价格将根据甲况与实际护理范围调整。", "Harga permulaan terpakai. Harga akhir bergantung pada keadaan kuku dan skop servis yang diperlukan."),
        aftercareNote: text("Follow the studio’s care guidance. Seek medical advice if pain, swelling or signs of infection are present.", "请遵循门店护理建议；如出现疼痛、肿胀或感染迹象，请寻求医疗意见。", "Ikuti panduan penjagaan studio. Dapatkan nasihat perubatan jika terdapat sakit, bengkak atau tanda jangkitan."),
      }, true),
      service("Gel Soak Off Removal", "From RM25", enquire, {
        shortDescription: text("Professional soak-off removal of existing gel product, adjusted to the product type and current nail condition.", "根据现有凝胶产品类型与甲况，进行专业浸泡式卸甲处理。", "Penanggalan rendaman profesional untuk produk gel sedia ada, disesuaikan mengikut jenis produk dan keadaan kuku."),
        included: list(["Gel condition check", "Professional soak-off removal", "Post-removal nail check"], ["凝胶与甲况检查", "专业浸泡式卸甲", "卸甲后指甲检查"], ["Pemeriksaan gel dan kuku", "Penanggalan rendaman profesional", "Pemeriksaan kuku selepas penanggalan"]),
        pricingNote: text("Starting price applies. Final pricing depends on product type, thickness, nail condition and removal complexity.", "页面显示为起价，最终价格将根据产品类型、厚度、甲况与卸除难度调整。", "Harga permulaan terpakai. Harga akhir bergantung pada jenis produk, ketebalan, keadaan kuku dan kerumitan penanggalan."),
        aftercareNote: text("Avoid peeling or forcing remaining product from the nail and follow the nail artist’s care guidance after removal.", "请勿自行撕除或强行剥离残留产品，并遵循美甲师的卸甲后护理建议。", "Elakkan mengopek atau memaksa baki produk daripada kuku dan ikuti panduan penjagaan selepas penanggalan."),
      }, true),
    ],
  },
];

export const serviceSource = {
  name: "Mezzanail Nail Studio printed price list",
  verifiedOn: "2026-07-18",
  note: "Prices updated July 2026. Where no duration is listed, please check with the studio when booking.",
};
