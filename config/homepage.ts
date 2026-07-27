const sharedImages = {
  services: [
    "/gallery/signature-white.jpg",
    "/gallery/minimal-manicure.jpg",
    "/gallery/extension-silver.jpg",
    "/gallery/chrome-neutral.jpg",
    "/gallery/editorial-black.jpg",
  ],
  nailWork: [
    "/gallery/signature-white.jpg",
    "/gallery/extension-silver.jpg",
    "/gallery/editorial-black.jpg",
    "/gallery/chrome-neutral.jpg",
    "/gallery/minimal-manicure.jpg",
  ],
  studio: "/campaigns/7th-anniversary/homepage-studio-campaign.png",
} as const;

const reviewSource = {
  rating: "4.9",
  ratingNote: "Public listing snapshot",
  reviews: [
    "Excellent service, very polite staff and reasonable pricing. The studio feels comfortable and especially confident with foot care.",
    "Excellent service and friendly staff. I love it here.",
    "The team is friendly and polite. The studio is calm, cosy, clean and neat. I would definitely return.",
  ],
} as const;

const english = {
  services: {
    eyebrow: "CURATED CARE",
    title: "Signature Services",
    subtitle: "Selected nail artistry and considered care",
    action: "Explore Services",
    items: [
      { title: "Hand Care", body: "Refined manicure rituals, gel colour and a precise finish.", href: "/services", image: sharedImages.services[0], alt: "Refined white manicure by Mezzanail Nail Studio", featured: true },
      { title: "Foot Care", body: "Comfort-led pedicure care designed to restore and refresh.", href: "/services", image: sharedImages.services[1], alt: "Soft neutral nail care finish by Mezzanail Nail Studio", featured: true },
      { title: "Nail Extensions", body: "Balanced structure and elegant length with a natural finish.", href: "/services", image: sharedImages.services[2], alt: "Silver nail extensions by Mezzanail Nail Studio", featured: false },
      { title: "Callus Removal", body: "Professional callus and Footlogix care for smoother feet.", href: "/services", image: sharedImages.services[3], alt: "Glossy neutral care finish by Mezzanail Nail Studio", featured: false },
      { title: "Waxing", body: "Considered waxing care delivered with comfort and precision.", href: "/services", image: sharedImages.services[4], alt: "Editorial beauty detail by Mezzanail Nail Studio", featured: false },
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
      { number: "01", title: "Precision", body: "Professional technique with close attention to every detail." },
      { number: "02", title: "Comfort", body: "A calm, hygienic and personalised service experience." },
      { number: "03", title: "Confidence", body: "Beautifully finished nails that feel distinctly your own." },
    ],
  },
  reviews: {
    eyebrow: "GOOGLE REVIEWS",
    title: "Loved by Our Customers",
    subtitle: "Real feedback from public customer reviews",
    action: "Read All Google Reviews",
    sourceLabel: "Google customer review",
    ...reviewSource,
  },
  membership: {
    eyebrow: "MEZZANAIL MEMBERSHIP",
    title: "Rewards designed around your visits.",
    subtitle: "Thoughtful privileges for every return to the studio",
    action: "Explore Membership",
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
    imageAlt: "Mezzanail 7th Anniversary Lucky Draw campaign",
  },
} as const;

export const homepageContent = {
  en: english,
  zh: {
    ...english,
    services: {
      ...english.services,
      eyebrow: "精选护理",
      subtitle: "精选美甲与护理服务",
      action: "查看服务",
      items: [
        { ...english.services.items[0], title: "手部护理", body: "精致修甲、凝胶色彩与细腻收尾。" },
        { ...english.services.items[1], title: "足部护理", body: "兼顾舒适、焕新与整洁效果的足部护理。" },
        { ...english.services.items[2], title: "美甲延伸", body: "平衡结构、优雅长度与自然完成效果。" },
        { ...english.services.items[3], title: "去茧护理", body: "专业去茧与 Footlogix 护理，让双足更平滑。" },
        { ...english.services.items[4], title: "蜜蜡脱毛", body: "以舒适与精准为先的专业蜜蜡护理。" },
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
        { number: "01", title: "Precision", body: "专业技术与细节" },
        { number: "02", title: "Comfort", body: "舒适、卫生与个人化服务" },
        { number: "03", title: "Confidence", body: "让每位顾客带着自信离开" },
      ],
    },
    reviews: {
      ...english.reviews,
      eyebrow: "GOOGLE 评价",
      subtitle: "真实顾客评价",
      action: "查看全部 Google 评价",
      sourceLabel: "Google 顾客评价",
      ratingNote: "公开列表快照",
    },
    membership: {
      ...english.membership,
      subtitle: "为每一次到访设计的专属会员礼遇",
      action: "探索会员礼遇",
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
      imageAlt: "Mezzanail 七周年幸运抽奖活动",
    },
  },
  ms: {
    ...english,
    services: {
      ...english.services,
      eyebrow: "PENJAGAAN PILIHAN",
      subtitle: "Seni kuku dan penjagaan terpilih",
      action: "Teroka Servis",
      items: [
        { ...english.services.items[0], title: "Penjagaan Tangan", body: "Ritual manicure, warna gel dan kemasan yang teliti." },
        { ...english.services.items[1], title: "Penjagaan Kaki", body: "Pedicure yang mengutamakan keselesaan dan kesegaran." },
        { ...english.services.items[2], title: "Sambungan Kuku", body: "Struktur seimbang, panjang elegan dan kemasan semula jadi." },
        { ...english.services.items[3], title: "Pembuangan Kulit Keras", body: "Penjagaan callus dan Footlogix untuk kaki lebih licin." },
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
        { number: "01", title: "Precision", body: "Teknik profesional dengan perhatian pada setiap butiran." },
        { number: "02", title: "Comfort", body: "Pengalaman yang tenang, bersih dan diperibadikan." },
        { number: "03", title: "Confidence", body: "Kemasan indah yang terasa benar-benar milik anda." },
      ],
    },
    reviews: {
      ...english.reviews,
      eyebrow: "ULASAN GOOGLE",
      subtitle: "Maklum balas sebenar daripada pelanggan",
      action: "Baca Semua Ulasan Google",
      sourceLabel: "Ulasan pelanggan Google",
      ratingNote: "Ringkasan senarai awam",
    },
    membership: {
      ...english.membership,
      subtitle: "Keistimewaan yang direka untuk setiap kunjungan",
      action: "Teroka Keahlian",
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
      imageAlt: "Kempen cabutan bertuah ulang tahun ke-7 Mezzanail",
    },
  },
} as const;

export const homepageNailWorkImages = sharedImages.nailWork;
export const homepageStudioImage = sharedImages.studio;
