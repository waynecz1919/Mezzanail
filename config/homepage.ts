const sharedImages = {
  services: [
    "/images/services/hand-care.webp",
    "/images/services/foot-care.webp",
    "/images/services/nail-extensions.webp",
    "/services/homepage/callus-removal-before-after-4x3.png",
    "/images/services/waxing.webp",
  ],
  nailWork: [
    { src: "/images/inspiration/g1.webp", alt: "Sheer nude almond nails with a fine gold line" },
    { src: "/images/inspiration/g2.webp", alt: "Short almond nails with a thin classic French tip" },
    { src: "/images/inspiration/g3.webp", alt: "Pink chrome nails with a pearl sheen" },
    { src: "/images/inspiration/g4.webp", alt: "Taupe nails with tortoiseshell accents" },
    { src: "/images/inspiration/g5.webp", alt: "Glossy espresso brown short nails" },
    { src: "/images/inspiration/g6.webp", alt: "Soft nude-pink pedicure" },
  ],
} as const;

export type HomepageHeroImage = {
  src: string;
  width: number;
  height: number;
  objectPosition?: string;
  alt: Record<"en" | "zh" | "ms", string>;
  slogan: Record<"en" | "zh" | "ms", string>;
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
      src: "/brand/hero/hero-1-v2.jpg",
      width: 816,
      height: 1020,
      objectPosition: "50% 70%",
      alt: {
        en: "Macro view of nude-pink nails with fine gold line art",
        zh: "裸粉色美甲与细致金线设计的近景",
        ms: "Pandangan dekat kuku merah jambu nude dengan garisan seni emas halus",
      },
      slogan: {
        en: "Artistry at your fingertips.",
        zh: "指尖上的艺术",
        ms: "Seni di hujung jari.",
      },
    },
    {
      src: "/brand/hero/hero-2.jpg",
      width: 1024,
      height: 1280,
      objectPosition: "65% 70%",
      alt: {
        en: "Nail artist in black gloves applying polish during a manicure",
        zh: "美甲师戴着黑色手套为顾客涂抹指甲油",
        ms: "Jurukuku bersarung tangan hitam sedang menyapu pengilat kuku",
      },
      slogan: {
        en: "Precision in every stroke.",
        zh: "每一笔，都是讲究",
        ms: "Teliti dalam setiap sapuan.",
      },
    },
    {
      src: "/brand/hero/hero-3.jpg",
      width: 1024,
      height: 1280,
      objectPosition: "90% 65%",
      alt: {
        en: "Two hands with French-tip nails holding a latte",
        zh: "双手展示法式美甲并捧着拿铁",
        ms: "Dua tangan berkuku French tip memegang latte",
      },
      slogan: {
        en: "Effortless elegance, every day.",
        zh: "优雅，成为日常",
        ms: "Anggun, setiap hari.",
      },
    },
    {
      src: "/brand/hero/hero-4.jpg",
      width: 1024,
      height: 1280,
      objectPosition: "70% 75%",
      alt: {
        en: "Pedicure with polished toes resting on a spa towel beside a petal foot bath",
        zh: "修饰整齐的双脚放在水疗毛巾上，旁边是花瓣泡脚盆",
        ms: "Pedicure dengan kedua-dua kaki di atas tuala spa di sisi rendaman kaki berkelopak",
      },
      slogan: {
        en: "Luxury, from heel to toe.",
        zh: "从足尖开始的宠爱",
        ms: "Kemewahan dari tumit ke hujung jari.",
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
      { title: "Hand Care", serviceCategoryId: "manicure", body: "Refined manicure rituals, gel colour and a precise finish.", href: "/services", image: sharedImages.services[0], alt: "Hand care treatment with a serum application", featured: true },
      { title: "Foot Care", serviceCategoryId: "pedicure", body: "Comfort-led pedicure care designed to restore and refresh.", href: "/services", image: sharedImages.services[1], alt: "Pedicure with serum application over polished toenails", featured: true },
      { title: "Nail Extensions", serviceCategoryId: "extensions", body: "Balanced structure and elegant length with a natural finish.", href: "/services", image: sharedImages.services[2], alt: "Nude almond nails with fine gold-line accents", featured: false },
      { title: "Callus Removal", serviceCategoryId: "callus", body: "Professional callus and Footlogix care for smoother feet.", href: "/services", image: sharedImages.services[3], alt: "Before and after heel callus removal result", featured: false },
      { title: "Waxing", serviceCategoryId: "waxing", body: "Considered waxing care delivered with comfort and precision.", href: "/services", image: sharedImages.services[4], alt: "Waxing treatment with a wooden spatula and gloved hands", featured: false },
    ],
  },
  work: {
    eyebrow: "STYLE INSPIRATION",
    title: "Style Inspiration",
    subtitle: "Ideas for your next set — see our real client work on Instagram.",
    action: "View more on Instagram",
    categories: ["Gold Line", "Classic French", "Pink Chrome", "Tortoiseshell", "Espresso Brown", "Soft Nude Pedicure"],
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
      eyebrow: "款式灵感",
      title: "款式灵感",
      subtitle: "为你的下一次美甲找灵感 —— 真实客人作品请看我们的 Instagram。",
      action: "前往 Instagram 查看更多",
      categories: ["金线裸粉", "经典法式", "粉色镜面", "琥珀纹理", "浓缩咖啡棕", "柔裸粉足部护理"],
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
      eyebrow: "INSPIRASI GAYA",
      title: "Inspirasi Gaya",
      subtitle: "Idea untuk set kuku anda seterusnya — lihat hasil kerja sebenar kami di Instagram.",
      action: "Lihat lagi di Instagram",
      categories: ["Garisan Emas", "French Klasik", "Krom Merah Jambu", "Corak Tortoiseshell", "Coklat Espresso", "Pedikur Nude Lembut"],
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
