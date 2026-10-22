const sharedImages = {
  services: [
    "/services/homepage/hand-care.png",
    "/services/homepage/foot-care.png",
    "/gallery/extension-silver.jpg",
    "/services/homepage/callus-removal-before-after-4x3.png",
    "/services/homepage/waxing-treatment.png",
  ],
  nailWork: [
    "/gallery/signature-white.jpg",
    "/gallery/extension-silver.jpg",
    "/gallery/editorial-black.jpg",
    "/gallery/chrome-neutral.jpg",
    "/gallery/minimal-manicure.jpg",
  ],
} as const;

export type HomepageHeroImage = {
  src: string;
  width: number;
  height: number;
  objectPosition?: string;
  alt: Record<"en" | "zh" | "ms", string>;
};

type HomepageImages = {
  heroImages: readonly HomepageHeroImage[];
  studioImage: string | null;
};

export const homepage: HomepageImages = {
  // HOW TO CHANGE THE HERO SLIDES:
  // - Replace files in /public/brand/hero/ and update this array only.
  // - Keep src, width, height, objectPosition and EN/ZH/MS alt text matched to each image.
  // - The first slide is priority-loaded; later slides lazy-load after page load.
  heroImages: [
    {
      src: "/brand/hero/hero-1.jpg",
      width: 1122,
      height: 1402,
      objectPosition: "60% 70%",
      alt: {
        en: "Soft nude gel nails with gold accents at Mezzanail Nail Studio, Melaka",
        zh: "马六甲 Mezzanail Nail Studio 的柔和裸粉凝胶美甲与精致金色点缀",
        ms: "Kuku gel nude lembut dengan aksen emas di Mezzanail Nail Studio, Melaka",
      },
    },
    {
      src: "/brand/hero/hero-2.jpg",
      width: 1080,
      height: 1350,
      objectPosition: "58% 68%",
      alt: {
        en: "Elegant gel manicure at Mezzanail Nail Studio, Melaka",
        zh: "马六甲 Mezzanail Nail Studio 的精致凝胶美甲",
        ms: "Manikur gel elegan di Mezzanail Nail Studio, Melaka",
      },
    },
    {
      src: "/brand/hero/hero-3.jpg",
      width: 1080,
      height: 1350,
      objectPosition: "62% 70%",
      alt: {
        en: "Premium nail work at Mezzanail Nail Studio, Melaka",
        zh: "马六甲 Mezzanail Nail Studio 的高品质美甲作品",
        ms: "Hasil kuku premium di Mezzanail Nail Studio, Melaka",
      },
    },
    {
      src: "/brand/hero/hero-4.jpg",
      width: 1080,
      height: 1350,
      objectPosition: "60% 72%",
      alt: {
        en: "Refined nail art at Mezzanail Nail Studio, Melaka",
        zh: "马六甲 Mezzanail Nail Studio 的精致美甲设计",
        ms: "Seni kuku halus di Mezzanail Nail Studio, Melaka",
      },
    },
  ],
  studioImage: null,
};

const reviewSource = {
  rating: "4.8",
  ratingNote: "120+ Google reviews",
  reviews: [
    "Excellent service, very polite staff and reasonable pricing. The studio feels comfortable and especially confident with foot care.",
    "Excellent service and friendly staff. I love it here.",
    "The team is friendly and polite. The studio is calm, cosy, clean and neat. I would definitely return.",
  ],
} as const;

const english = {
  hero: {
    eyebrow: "Nail Studio · Melaka",
    title: "Premium Nail Care in Melaka",
    lede: "Manicure, pedicure, nail extensions, callus care and waxing from Mezzanail Nail Studio in Melaka.",
    bookNow: "Book Now",
  },
  services: {
    eyebrow: "CURATED CARE",
    title: "Signature Services",
    subtitle: "Selected nail artistry and considered care",
    action: "Explore Services",
    items: [
      { title: "Hand Care", serviceCategoryId: "manicure", body: "Refined manicure rituals, gel colour and a precise finish.", href: "/services", image: sharedImages.services[0], alt: "Soft pink manicure on hands with dried lavender", featured: true },
      { title: "Foot Care", serviceCategoryId: "pedicure", body: "Comfort-led pedicure care designed to restore and refresh.", href: "/services", image: sharedImages.services[1], alt: "French pedicure with a white lily", featured: true },
      { title: "Nail Extensions", serviceCategoryId: "extensions", body: "Balanced structure and elegant length with a natural finish.", href: "/services", image: sharedImages.services[2], alt: "Silver nail extensions by Mezzanail Nail Studio", featured: false },
      { title: "Callus Removal", serviceCategoryId: "callus", body: "Professional callus and Footlogix care for smoother feet.", href: "/services", image: sharedImages.services[3], alt: "Before and after heel callus removal result", featured: false },
      { title: "Waxing", serviceCategoryId: "waxing", body: "Considered waxing care delivered with comfort and precision.", href: "/services", image: sharedImages.services[4], alt: "Leg waxing treatment at a beauty studio", featured: false },
    ],
  },
  work: {
    eyebrow: "THE EDIT",
    title: "Selected Nail Work",
    subtitle: "A quiet gallery of distinctive finishes",
    action: "View more on Instagram",
    categories: ["Signature White", "Silver Structure", "Editorial Black", "Chrome Neutral", "Modern Minimal"],
  },
  why: {
    eyebrow: "WHY MEZZANAIL",
    title: "Quiet confidence, built into every visit.",
    subtitle: "A focused studio experience shaped by technique and care",
    items: [
      { number: "01", title: "Since 2019 in Melaka", body: "Seven years of nail care for Melaka, from everyday gel to bridal sets." },
      { number: "02", title: "Footlogix foot care", body: "Professional callus removal and Footlogix treatments for healthier, smoother feet." },
      { number: "03", title: "Member rewards", body: "Your Member Center keeps your balance, vouchers and packages in one place." },
    ],
  },
  reviews: {
    eyebrow: "GOOGLE REVIEWS",
    title: "Loved by Our Customers",
    subtitle: "Real feedback from public customer reviews",
    action: "Read All Google Reviews",
    sourceLabel: "Google customer review",
    viewLabel: "View on Google",
    ...reviewSource,
  },
  membership: {
    eyebrow: "MEZZANAIL MEMBERSHIP",
    title: "Your membership, all in one place.",
    subtitle: "View your Member Center balance, vouchers, packages and latest records",
    action: "Membership",
  },
  studio: {
    eyebrow: "VISIT THE STUDIO",
    title: "Mezzanail Nail Studio",
    subtitle: "Your next considered appointment begins here.",
    addressLabel: "Studio",
    hoursLabel: "Opening hours",
    phoneLabel: "Contact",
    mapAction: "Open in Maps",
    bookAction: "Book Appointment",
    whatsappAction: "WhatsApp",
    imageAlt: "French pedicure with a white flower",
  },
} as const;

export const homepageContent = {
  en: english,
  zh: {
    ...english,
    hero: {
      eyebrow: "美甲工作室 · 马六甲",
      title: "马六甲高品质美甲护理",
      lede: "马六甲 Mezzanail Nail Studio 提供 Manicure、Pedicure、Nail Extensions、Callus Removal 与 Waxing 服务。",
      bookNow: "立即预约",
    },
    services: {
      ...english.services,
      eyebrow: "精选护理",
      subtitle: "精选美甲与护理服务",
      action: "查看服务",
      items: [
        { ...english.services.items[0], title: "Hand Care", body: "精致修甲、凝胶色彩与细腻收尾。" },
        { ...english.services.items[1], title: "Foot Care", body: "兼顾舒适、焕新与整洁效果的足部护理。" },
        { ...english.services.items[2], title: "Nail Extensions", body: "平衡结构、优雅长度与自然完成效果。" },
        { ...english.services.items[3], title: "Callus Removal", body: "专业去茧与 Footlogix 护理，让双足更平滑。" },
        { ...english.services.items[4], title: "Waxing", body: "以舒适与精准为先的专业蜜蜡护理。" },
      ],
    },
    work: {
      ...english.work,
      eyebrow: "精选作品",
      subtitle: "精选美甲作品",
      action: "前往 Instagram 查看更多",
      categories: ["标志性白色", "银色结构", "编辑感黑色", "裸色镜面", "现代极简"],
    },
    why: {
      ...english.why,
      title: "把从容自信，融入每一次到访。",
      subtitle: "以专业技术与细致照顾，塑造专注的门店体验",
      items: [
        { number: "01", title: "2019 年起扎根马六甲", body: "七年专注美甲，从日常凝胶到新娘美甲。" },
        { number: "02", title: "Footlogix 专业足部护理", body: "专业去茧与 Footlogix 护理，让双脚更健康柔滑。" },
        { number: "03", title: "会员礼遇", body: "会员中心一站查看余额、礼券与配套。" },
      ],
    },
    reviews: {
      ...english.reviews,
      eyebrow: "GOOGLE 评价",
      subtitle: "真实顾客评价",
      action: "查看全部 Google 评价",
      sourceLabel: "Google 顾客评价",
      viewLabel: "在 Google 查看",
      ratingNote: "120+ 则 Google 评价",
    },
    membership: {
      ...english.membership,
      title: "会员资料，一目了然。",
      subtitle: "查看会员余额、礼券、配套与最近记录",
      action: "会员中心",
    },
    studio: {
      ...english.studio,
      eyebrow: "到访门店",
      subtitle: "下一次精致体验，从这里开始。",
      addressLabel: "门店",
      hoursLabel: "营业时间",
      phoneLabel: "联系方式",
      mapAction: "打开地图",
      bookAction: "预约服务",
      whatsappAction: "WhatsApp 联系",
      imageAlt: "搭配白色花朵的法式足部护理",
    },
  },
  ms: {
    ...english,
    hero: {
      eyebrow: "Studio Kuku · Melaka",
      title: "Penjagaan Kuku Premium di Melaka",
      lede: "Manicure, Pedicure, Nail Extensions, Callus Removal dan Waxing di Mezzanail Nail Studio, Melaka.",
      bookNow: "Tempah Sekarang",
    },
    services: {
      ...english.services,
      eyebrow: "PENJAGAAN PILIHAN",
      subtitle: "Seni kuku dan penjagaan terpilih",
      action: "Teroka Servis",
      items: [
        { ...english.services.items[0], title: "Hand Care", body: "Ritual manicure, warna gel dan kemasan yang teliti." },
        { ...english.services.items[1], title: "Foot Care", body: "Pedicure yang mengutamakan keselesaan dan kesegaran." },
        { ...english.services.items[2], title: "Nail Extensions", body: "Struktur seimbang, panjang elegan dan kemasan semula jadi." },
        { ...english.services.items[3], title: "Callus Removal", body: "Penjagaan callus dan Footlogix untuk kaki lebih licin." },
        { ...english.services.items[4], title: "Waxing", body: "Rawatan waxing yang selesa, teliti dan profesional." },
      ],
    },
    work: {
      ...english.work,
      eyebrow: "HASIL PILIHAN",
      subtitle: "Galeri tenang dengan kemasan tersendiri",
      action: "Lihat lagi di Instagram",
      categories: ["Putih Signature", "Struktur Perak", "Hitam Editorial", "Neutral Krom", "Minimal Moden"],
    },
    why: {
      ...english.why,
      title: "Keyakinan tenang dalam setiap kunjungan.",
      subtitle: "Pengalaman studio yang dibentuk oleh teknik dan perhatian",
      items: [
        { number: "01", title: "Sejak 2019 di Melaka", body: "Tujuh tahun penjagaan kuku di Melaka, dari gel harian hingga set pengantin." },
        { number: "02", title: "Penjagaan kaki Footlogix", body: "Rawatan kalus profesional dan Footlogix untuk kaki yang lebih sihat dan lembut." },
        { number: "03", title: "Ganjaran ahli", body: "Member Center menyimpan baki, baucar dan pakej anda di satu tempat." },
      ],
    },
    reviews: {
      ...english.reviews,
      eyebrow: "ULASAN GOOGLE",
      subtitle: "Maklum balas sebenar daripada pelanggan",
      action: "Baca Semua Ulasan Google",
      sourceLabel: "Ulasan pelanggan Google",
      viewLabel: "Lihat di Google",
      ratingNote: "120+ ulasan Google",
    },
    membership: {
      ...english.membership,
      title: "Keahlian anda, semuanya di satu tempat.",
      subtitle: "Lihat baki, baucar, pakej dan rekod terkini di Pusat Ahli",
      action: "Keahlian",
    },
    studio: {
      ...english.studio,
      eyebrow: "KUNJUNGI STUDIO",
      subtitle: "Janji temu anda yang seterusnya bermula di sini.",
      addressLabel: "Studio",
      hoursLabel: "Waktu operasi",
      phoneLabel: "Hubungi",
      mapAction: "Buka Peta",
      bookAction: "Tempah Janji Temu",
      whatsappAction: "WhatsApp",
      imageAlt: "Pedikur Perancis dengan bunga putih",
    },
  },
} as const;

export const homepageNailWorkImages = sharedImages.nailWork;
