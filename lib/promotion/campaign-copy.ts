import type { PromotionLanguage } from "@/lib/promotion/campaign-config";

export const promotionLanguageLabels: Record<PromotionLanguage, string> = {
  en: "English",
  zh: "中文",
  ms: "Bahasa Melayu",
};

export const promotionLanguageShortLabels: Record<PromotionLanguage, string> = {
  en: "EN",
  zh: "中",
  ms: "BM",
};

type PromotionCampaignDetails = {
  steps: Array<{ title: string; description: string }>;
  prizes: Array<{ name: string; description: string }>;
};

export const promotionCampaignDetails: Record<
  PromotionLanguage,
  PromotionCampaignDetails
> = {
  en: {
    steps: [
      {
        title: "Join Our Membership",
        description:
          "Become a Mezzanail member to take part in our anniversary celebration.",
      },
      {
        title: "Scan & Share With 3 Friends",
        description:
          "Scan the campaign QR and share the celebration with three friends.",
      },
      {
        title: "Join the 7th Anniversary Lucky Draw",
        description: "Complete the campaign steps for your chance to win.",
      },
    ],
    prizes: [
      {
        name: "Dyson Supersonic™ Travel Hair Dryer",
        description:
          "A premium travel hair dryer for beautiful styling wherever you go.",
      },
      {
        name: "HUAWEI Watch Fit 5",
        description:
          "A stylish smartwatch designed for everyday wellbeing.",
      },
      {
        name: "Xiaomi Robot Vacuum",
        description:
          "A smart home helper that keeps daily cleaning effortless.",
      },
      {
        name: "Beauty Vouchers & Weekly Rewards",
        description:
          "Enjoy beauty treats, member surprises and more chances to celebrate.",
      },
    ],
  },
  zh: {
    steps: [
      {
        title: "加入会员",
        description: "成为 Mezzanail 会员，参加我们的周年庆典。",
      },
      {
        title: "扫码并分享给3位朋友",
        description: "扫描活动二维码，并把周年庆典分享给三位朋友。",
      },
      {
        title: "参加七周年幸运抽奖",
        description: "完成活动步骤，即有机会赢取周年好礼。",
      },
    ],
    prizes: [
      {
        name: "Dyson Supersonic™ 旅行吹风机",
        description: "随时随地享受高级、便捷的美发体验。",
      },
      {
        name: "HUAWEI Watch Fit 5",
        description: "兼具时尚设计与日常健康功能的智能手表。",
      },
      {
        name: "Xiaomi 扫地机器人",
        description: "让日常家居清洁更轻松的智能好帮手。",
      },
      {
        name: "美容礼券与每周奖励",
        description: "享受美容好礼、会员惊喜和更多中奖机会。",
      },
    ],
  },
  ms: {
    steps: [
      {
        title: "Sertai Keahlian Kami",
        description:
          "Jadi ahli Mezzanail untuk menyertai sambutan ulang tahun kami.",
      },
      {
        title: "Imbas & Kongsi Dengan 3 Rakan",
        description:
          "Imbas kod QR kempen dan kongsi sambutan ini dengan tiga rakan.",
      },
      {
        title: "Sertai Cabutan Bertuah Ulang Tahun Ke-7",
        description:
          "Lengkapkan langkah kempen untuk peluang memenangi hadiah.",
      },
    ],
    prizes: [
      {
        name: "Dyson Supersonic™ Travel Hair Dryer",
        description:
          "Pengering rambut perjalanan premium untuk gaya cantik di mana sahaja.",
      },
      {
        name: "HUAWEI Watch Fit 5",
        description:
          "Jam pintar bergaya yang direka untuk kesejahteraan harian.",
      },
      {
        name: "Xiaomi Robot Vacuum",
        description:
          "Pembantu rumah pintar yang memudahkan pembersihan harian.",
      },
      {
        name: "Baucar Kecantikan & Ganjaran Mingguan",
        description:
          "Nikmati hadiah kecantikan, kejutan ahli dan lebih banyak peluang untuk menang.",
      },
    ],
  },
};

export const promotionPrizeTerms: Record<PromotionLanguage, string> = {
  en: "Campaign prizes include one Dyson Supersonic™ Travel Hair Dryer, one HUAWEI Watch Fit 5, one Xiaomi Robot Vacuum, beauty vouchers and weekly rewards. Prizes are non-transferable and cannot be exchanged for cash unless Mezzanail states otherwise.",
  zh: "活动奖品包括一台 Dyson Supersonic™ 旅行吹风机、一只 HUAWEI Watch Fit 5、一台 Xiaomi 扫地机器人、美容礼券及每周奖励。除非 Mezzanail 另有说明，奖品不可转让，也不可兑换现金。",
  ms: "Hadiah kempen termasuk satu Dyson Supersonic™ Travel Hair Dryer, satu HUAWEI Watch Fit 5, satu Xiaomi Robot Vacuum, baucar kecantikan dan ganjaran mingguan. Hadiah tidak boleh dipindah milik atau ditukar dengan wang tunai kecuali dinyatakan sebaliknya oleh Mezzanail.",
};

export const promotionCopy = {
  en: {
    bookAppointment: "Book Appointment",
    shareViaWhatsApp: "Share via WhatsApp",
    shareAccessibleName:
      "Share the Mezzanail anniversary campaign via WhatsApp",
    status: "7th Anniversary Celebration",
    brandKicker: "Mezzanail Nail Studio",
    heroTitle: "7th Anniversary",
    heroSubtitle: "Lucky Draw Campaign",
    displayDates: "26 July – 30 September 2026",
    introEyebrow: "Seven wonderful years",
    introTitle: "Celebrate 7 Wonderful Years With Us",
    introLead:
      "Book your appointment, join our membership and celebrate with us for a chance to win exciting prizes.",
    campaignPeriod: "Campaign period",
    prizeEyebrow: "Anniversary lucky draw",
    prizeTitle: "Beautiful Reasons to Celebrate",
    prizeLead:
      "Every prize is part of our thank-you to the community that has grown with Mezzanail.",
    winner: "Winner",
    prizeDisclaimer:
      "Prize eligibility is subject to the official campaign terms. Participation does not guarantee a prize.",
    howEyebrow: "How it works",
    howTitle: "Three Simple Steps",
    steps: [
      {
        title: "Book Your Appointment",
        description:
          "Choose your preferred service, date and appointment time.",
      },
      {
        title: "Join Our Membership",
        description:
          "Become a Mezzanail member and enjoy exclusive member benefits and anniversary rewards.",
      },
      {
        title: "Like & Share Our Page",
        description:
          "Like and share our page with friends to spread the anniversary celebration.",
      },
    ],
    prizes: [
      {
        name: "Apple Watch SE 3",
        description: "A stylish everyday smartwatch for one lucky winner.",
      },
      {
        name: "Dyson Supersonic™ Travel Hair Dryer",
        description:
          "Compact, premium and designed for beautiful hair wherever you go.",
      },
      {
        name: "Exclusive Member Rewards",
        description:
          "Enjoy anniversary rewards, member benefits and special surprises.",
      },
      {
        name: "Lucky Draw Prizes",
        description:
          "Every eligible participation brings another chance to celebrate and win.",
      },
    ],
    shareEyebrow: "Pass the celebration on",
    shareTitle: "Share With Someone Special",
    shareLead:
      "Send the English and Chinese campaign message together through WhatsApp. Any valid referral code in your link stays attached.",
    languageLegend: "Website language",
    referralPrefix: "Referral code",
    referralSuffix: "will be preserved in your share.",
    qrEyebrow: "Share the celebration",
    qrTitle: "Tap, scan or share this page with your friends.",
    downloadPng: "Download PNG",
    downloadSvg: "Download SVG",
    finalEyebrow: "Celebrate with Mezzanail",
    finalTitle: "Your Next Beautiful Appointment Awaits",
    policy:
      "Appointment availability is subject to confirmation. Promotion participation and prize eligibility are subject to the official campaign terms and conditions.",
    viewTerms: "View Terms & Conditions",
    footerCampaign: "7th Anniversary Celebration",
    bookNow: "Book Now",
    share: "Share",
  },
  zh: {
    bookAppointment: "立即预约",
    shareViaWhatsApp: "通过 WhatsApp 分享",
    shareAccessibleName: "通过 WhatsApp 分享 Mezzanail 七周年活动",
    status: "七周年庆典",
    brandKicker: "Mezzanail 美甲工作室",
    heroTitle: "七周年庆典",
    heroSubtitle: "幸运抽奖活动",
    displayDates: "2026年7月26日至9月30日",
    introEyebrow: "相伴七年，感谢有你",
    introTitle: "与我们一起庆祝精彩七周年",
    introLead:
      "预约服务、加入会员并参与周年庆典，即有机会赢取精彩奖品。",
    campaignPeriod: "活动日期",
    prizeEyebrow: "周年幸运抽奖",
    prizeTitle: "值得期待的周年好礼",
    prizeLead: "每一份奖品，都是 Mezzanail 对一路陪伴我们的顾客表达感谢。",
    winner: "名得主",
    prizeDisclaimer:
      "奖品资格须遵守正式活动条款。参与活动并不保证一定获奖。",
    howEyebrow: "参与方式",
    howTitle: "简单三步骤",
    steps: [
      {
        title: "预约您的服务",
        description: "选择您喜欢的服务、日期和预约时间。",
      },
      {
        title: "加入我们的会员计划",
        description: "成为 Mezzanail 会员，享受会员专属福利与周年奖励。",
      },
      {
        title: "点赞并分享我们的页面",
        description: "点赞并把活动页面分享给朋友，一起庆祝 Mezzanail 七周年。",
      },
    ],
    prizes: [
      {
        name: "Apple Watch SE 3",
        description: "时尚实用的日常智能手表，将由一名幸运得主赢取。",
      },
      {
        name: "Dyson Supersonic™ 旅行吹风机",
        description: "轻巧、高级，为随时随地保持美丽秀发而设计。",
      },
      {
        name: "会员专属奖励",
        description: "享受周年奖励、会员福利与特别惊喜。",
      },
      {
        name: "幸运抽奖奖品",
        description: "每一次符合资格的参与，都多一份庆祝与获奖机会。",
      },
    ],
    shareEyebrow: "分享周年喜悦",
    shareTitle: "把庆典分享给重要的人",
    shareLead:
      "通过 WhatsApp 同时分享中英文活动信息。链接中的有效推荐码会自动保留。",
    languageLegend: "网站语言",
    referralPrefix: "推荐码",
    referralSuffix: "会保留在您的分享链接中。",
    qrEyebrow: "分享周年庆典",
    qrTitle: "轻触、扫描或把这个页面分享给朋友。",
    downloadPng: "下载 PNG",
    downloadSvg: "下载 SVG",
    finalEyebrow: "与 Mezzanail 一起庆祝",
    finalTitle: "期待与您开启下一次美丽预约",
    policy:
      "预约时段须经确认。活动参与和奖品资格须遵守正式活动条款与细则。",
    viewTerms: "查看活动条款",
    footerCampaign: "七周年庆典",
    bookNow: "立即预约",
    share: "分享",
  },
  ms: {
    bookAppointment: "Buat Tempahan",
    shareViaWhatsApp: "Kongsi melalui WhatsApp",
    shareAccessibleName:
      "Kongsi kempen ulang tahun Mezzanail melalui WhatsApp",
    status: "Sambutan Ulang Tahun Ke-7",
    brandKicker: "Mezzanail Nail Studio",
    heroTitle: "Ulang Tahun Ke-7",
    heroSubtitle: "Kempen Cabutan Bertuah",
    displayDates: "26 Julai – 30 September 2026",
    introEyebrow: "Tujuh tahun yang indah",
    introTitle: "Raikan 7 Tahun Bersama Kami",
    introLead:
      "Buat tempahan, sertai keahlian kami dan raikan ulang tahun bersama untuk peluang memenangi hadiah menarik.",
    campaignPeriod: "Tempoh kempen",
    prizeEyebrow: "Cabutan bertuah ulang tahun",
    prizeTitle: "Hadiah Istimewa Untuk Diraikan",
    prizeLead:
      "Setiap hadiah ialah tanda terima kasih kami kepada komuniti yang membesar bersama Mezzanail.",
    winner: "Pemenang",
    prizeDisclaimer:
      "Kelayakan hadiah tertakluk pada terma rasmi kempen. Penyertaan tidak menjamin kemenangan.",
    howEyebrow: "Cara penyertaan",
    howTitle: "Tiga Langkah Mudah",
    steps: [
      {
        title: "Buat Tempahan Anda",
        description:
          "Pilih servis, tarikh dan masa janji temu yang anda inginkan.",
      },
      {
        title: "Sertai Keahlian Kami",
        description:
          "Jadi ahli Mezzanail dan nikmati manfaat eksklusif serta ganjaran ulang tahun.",
      },
      {
        title: "Suka & Kongsi Halaman Kami",
        description:
          "Suka dan kongsi halaman kami dengan rakan-rakan untuk menyebarkan sambutan ini.",
      },
    ],
    prizes: [
      {
        name: "Apple Watch SE 3",
        description:
          "Jam pintar bergaya untuk kegunaan harian bagi seorang pemenang bertuah.",
      },
      {
        name: "Dyson Supersonic™ Travel Hair Dryer",
        description:
          "Kompak, premium dan direka untuk rambut cantik di mana sahaja.",
      },
      {
        name: "Ganjaran Eksklusif Ahli",
        description:
          "Nikmati ganjaran ulang tahun, manfaat ahli dan kejutan istimewa.",
      },
      {
        name: "Hadiah Cabutan Bertuah",
        description:
          "Setiap penyertaan yang layak memberi satu lagi peluang untuk meraikan dan menang.",
      },
    ],
    shareEyebrow: "Kongsi kemeriahan",
    shareTitle: "Kongsi Dengan Insan Istimewa",
    shareLead:
      "Kongsi mesej kempen dalam bahasa Inggeris dan Cina melalui WhatsApp. Kod rujukan yang sah akan dikekalkan.",
    languageLegend: "Bahasa laman web",
    referralPrefix: "Kod rujukan",
    referralSuffix: "akan dikekalkan dalam pautan perkongsian anda.",
    qrEyebrow: "Kongsi sambutan",
    qrTitle: "Sentuh, imbas atau kongsi halaman ini dengan rakan-rakan.",
    downloadPng: "Muat turun PNG",
    downloadSvg: "Muat turun SVG",
    finalEyebrow: "Raikan bersama Mezzanail",
    finalTitle: "Tempahan Cantik Anda Seterusnya Menanti",
    policy:
      "Ketersediaan janji temu tertakluk pada pengesahan. Penyertaan promosi dan kelayakan hadiah tertakluk pada terma dan syarat rasmi kempen.",
    viewTerms: "Lihat Terma & Syarat",
    footerCampaign: "Sambutan Ulang Tahun Ke-7",
    bookNow: "Tempah Sekarang",
    share: "Kongsi",
  },
} as const;

export const termsCopy = {
  en: {
    back: "Back to celebration",
    eyebrow: "Mezzanail 7th Anniversary",
    title: "Campaign Terms & Conditions",
    updated: "Last updated",
    lastUpdatedDate: "26 July 2026",
    intro:
      "These concise terms explain the main conditions for the Mezzanail 7th Anniversary Lucky Draw Campaign. Mezzanail may publish further operational details when required.",
    sections: [
      {
        title: "Campaign period",
        body: "The Mezzanail 7th Anniversary Lucky Draw Campaign runs from 26 July to 30 September 2026, inclusive, unless Mezzanail announces an amendment.",
      },
      {
        title: "Participation",
        body: "Participation is available to eligible Mezzanail customers during the campaign period. Appointment availability remains subject to confirmation. A booking alone does not guarantee a prize.",
      },
      {
        title: "Prizes",
        body: "Campaign prizes include one Apple Watch SE 3, one Dyson Supersonic™ Travel Hair Dryer, exclusive member rewards and other lucky draw prizes. Prizes are non-transferable and cannot be exchanged for cash unless Mezzanail states otherwise.",
      },
      {
        title: "Winner selection",
        body: "Eligible winners will be selected and contacted using the details available to Mezzanail. Mezzanail may request reasonable proof of identity or participation before releasing a prize.",
      },
      {
        title: "Referral links",
        body: "Referral codes in shared links are recorded only for campaign attribution at this stage. They do not automatically grant bonus credit, rewards or additional entries.",
      },
      {
        title: "Changes and enquiries",
        body: "Mezzanail may update these terms when reasonably necessary. Material updates will be published on this page. For campaign enquiries, contact Mezzanail through WhatsApp.",
      },
    ],
    returnCampaign: "Return to Campaign",
    contact: "Contact Mezzanail",
  },
  zh: {
    back: "返回周年活动",
    eyebrow: "Mezzanail 七周年",
    title: "活动条款与细则",
    updated: "最后更新",
    lastUpdatedDate: "2026年7月26日",
    intro:
      "以下简要条款说明 Mezzanail 七周年幸运抽奖活动的主要条件。Mezzanail 可在需要时公布进一步的活动细则。",
    sections: [
      {
        title: "活动日期",
        body: "除非 Mezzanail 另行公布更改，本次七周年幸运抽奖活动从2026年7月26日至9月30日举行，包括首尾两日。",
      },
      {
        title: "参与资格",
        body: "符合资格的 Mezzanail 顾客可在活动期间参与。预约时段仍须经确认，单独完成预约并不保证一定获奖。",
      },
      {
        title: "活动奖品",
        body: "奖品包括一份 Apple Watch SE 3、一份 Dyson Supersonic™ 旅行吹风机、会员专属奖励及其他幸运抽奖奖品。除非 Mezzanail 另有说明，奖品不可转让或兑换现金。",
      },
      {
        title: "得主选出与联系",
        body: "符合资格的得主将根据 Mezzanail 所持有的联系资料接获通知。发放奖品前，Mezzanail 可要求合理的身份证明或参与证明。",
      },
      {
        title: "推荐链接",
        body: "现阶段，分享链接中的推荐码仅用于活动来源记录，不会自动发放奖金、奖励或额外抽奖机会。",
      },
      {
        title: "更改与咨询",
        body: "Mezzanail 可在合理需要时更新条款，重要更新会公布在本页面。如有活动疑问，请通过 WhatsApp 联系 Mezzanail。",
      },
    ],
    returnCampaign: "返回活动页面",
    contact: "联系 Mezzanail",
  },
  ms: {
    back: "Kembali ke sambutan",
    eyebrow: "Ulang Tahun Ke-7 Mezzanail",
    title: "Terma & Syarat Kempen",
    updated: "Kemas kini terakhir",
    lastUpdatedDate: "26 Julai 2026",
    intro:
      "Terma ringkas ini menerangkan syarat utama Kempen Cabutan Bertuah Ulang Tahun Ke-7 Mezzanail. Mezzanail boleh menerbitkan butiran operasi tambahan apabila diperlukan.",
    sections: [
      {
        title: "Tempoh kempen",
        body: "Kempen Cabutan Bertuah Ulang Tahun Ke-7 Mezzanail berlangsung dari 26 Julai hingga 30 September 2026, termasuk kedua-dua tarikh, kecuali pindaan diumumkan oleh Mezzanail.",
      },
      {
        title: "Penyertaan",
        body: "Pelanggan Mezzanail yang layak boleh menyertai sepanjang tempoh kempen. Ketersediaan janji temu tertakluk pada pengesahan. Tempahan sahaja tidak menjamin hadiah.",
      },
      {
        title: "Hadiah",
        body: "Hadiah termasuk satu Apple Watch SE 3, satu Dyson Supersonic™ Travel Hair Dryer, ganjaran eksklusif ahli dan hadiah cabutan bertuah lain. Hadiah tidak boleh dipindah milik atau ditukar dengan wang tunai kecuali dinyatakan sebaliknya.",
      },
      {
        title: "Pemilihan pemenang",
        body: "Pemenang yang layak akan dipilih dan dihubungi menggunakan maklumat yang tersedia kepada Mezzanail. Bukti identiti atau penyertaan yang munasabah mungkin diperlukan sebelum hadiah diberikan.",
      },
      {
        title: "Pautan rujukan",
        body: "Kod rujukan dalam pautan perkongsian hanya direkodkan untuk atribusi kempen pada peringkat ini. Ia tidak memberikan kredit bonus, ganjaran atau penyertaan tambahan secara automatik.",
      },
      {
        title: "Perubahan dan pertanyaan",
        body: "Mezzanail boleh mengemas kini terma ini apabila diperlukan. Perubahan penting akan diterbitkan di halaman ini. Hubungi Mezzanail melalui WhatsApp untuk pertanyaan kempen.",
      },
    ],
    returnCampaign: "Kembali ke Kempen",
    contact: "Hubungi Mezzanail",
  },
} as const;
