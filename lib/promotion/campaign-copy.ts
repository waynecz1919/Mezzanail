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
    lastUpdatedDate: "27 July 2026",
    intro:
      "These terms govern the Mezzanail 7th Anniversary Lucky Draw Campaign. By submitting an entry, a participant confirms that the entry is accurate and agrees to these terms.",
    sections: [
      {
        title: "Organiser and contact",
        body: "The organiser is Mezzanail Nail Studio, 36-1, Jalan Seri 7, Taman Cheng Baru, 75260 Melaka, Malaysia. Campaign enquiries may be sent through WhatsApp to +60 16-2121 332.",
      },
      {
        title: "Campaign period",
        body: "The campaign runs from 26 July to 30 September 2026, inclusive, based on Malaysia time. Entries received outside that period are not eligible unless Mezzanail publishes an extension.",
      },
      {
        title: "Eligibility and entry steps",
        body: "Eligible Mezzanail customers must join the Mezzanail membership, scan the official campaign QR or open the official campaign link, share the campaign with three friends, and complete the lucky draw entry requested by the studio. Appointment availability is subject to confirmation. A booking or share alone does not guarantee an entry or prize.",
      },
      {
        title: "Valid entries",
        body: "An entry must be complete, genuine, verifiable and linked to the participant’s own contact details. Duplicate, automated, altered, incomplete or fraudulent entries may be rejected. Referral codes are used for campaign attribution and do not automatically create bonus credit, rewards or extra entries.",
      },
      {
        title: "Prizes",
        body: "Prizes include one Dyson Supersonic™ Travel Hair Dryer, one HUAWEI Watch Fit 5, one Xiaomi Robot Vacuum, beauty vouchers and weekly rewards. A prize is subject to availability, is non-transferable and cannot be exchanged for cash unless Mezzanail confirms otherwise in writing. If a stated prize becomes unavailable for reasons beyond Mezzanail’s reasonable control, a replacement of reasonably comparable value may be provided.",
      },
      {
        title: "Winner selection and notification",
        body: "Winners will be selected by a random draw from verified eligible entries after the campaign closes. Mezzanail will contact a selected winner using the submitted or membership contact details and may request reasonable proof of identity, membership and participation. A winner who does not respond within seven days may forfeit the prize and a replacement winner may be drawn.",
      },
      {
        title: "Collection and disqualification",
        body: "Prize collection or delivery arrangements will be confirmed directly. Mezzanail may disqualify an entry for fraud, manipulation, abuse, breach of these terms or failure to provide reasonable verification. The organiser’s decision on verification and prize administration is final, subject to applicable law.",
      },
      {
        title: "Personal data and announcements",
        body: "Personal data is used to verify entries, administer the draw, contact winners, fulfil prizes and maintain an accountable campaign record under the Mezzanail Privacy Policy. Any public winner announcement will use limited information, such as a first name and initial, unless further consent is obtained.",
      },
      {
        title: "Changes, suspension or cancellation",
        body: "Mezzanail may make a reasonably necessary change, suspend or cancel the campaign where fraud, technical failure, legal requirements or events outside reasonable control affect fair operation. Material changes will be published on the campaign or terms page.",
      },
      {
        title: "Liability and prize brands",
        body: "Nothing in these terms excludes rights or liability that cannot lawfully be excluded. To the extent permitted by law, Mezzanail is not responsible for indirect loss or a third-party platform failure outside its reasonable control. Prize brand names and trade marks belong to their owners; the campaign is not sponsored or endorsed by those brands unless expressly stated.",
      },
      {
        title: "Language and governing law",
        body: "These terms are governed by Malaysian law. The English, Chinese and Bahasa Melayu versions are intended to communicate the same conditions; if an inconsistency cannot be resolved, the English version prevails to the extent permitted by law.",
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
    lastUpdatedDate: "2026年7月27日",
    intro:
      "本条款适用于 Mezzanail 七周年幸运抽奖活动。提交参与资料即表示参加者确认资料准确，并同意遵守本条款。",
    sections: [
      {
        title: "主办方与联系方式",
        body: "主办方为 Mezzanail Nail Studio，地址：36-1, Jalan Seri 7, Taman Cheng Baru, 75260 Melaka, Malaysia。活动咨询可通过 WhatsApp 联系 +60 16-2121 332。",
      },
      {
        title: "活动期间",
        body: "活动时间为2026年7月26日至9月30日（含首尾两日），以马来西亚时间为准。除非 Mezzanail 公布延长活动，活动期外收到的参与资料不符合资格。",
      },
      {
        title: "参与资格与步骤",
        body: "符合资格的 Mezzanail 顾客须加入 Mezzanail 会员、扫描官方活动二维码或打开官方活动链接、把活动分享给三位朋友，并完成门店指定的幸运抽奖登记。预约时段仍须确认；仅预约或分享并不自动保证获得抽奖资格或奖品。",
      },
      {
        title: "有效参与资料",
        body: "参与资料必须完整、真实、可核实，并使用参加者本人的联系方式。重复、自动生成、篡改、不完整或欺诈性资料可被拒绝。推荐码仅用于记录活动来源，不会自动产生额外积分、奖励或抽奖次数。",
      },
      {
        title: "活动奖品",
        body: "奖品包括一台 Dyson Supersonic™ 旅行吹风机、一只 HUAWEI Watch Fit 5、一台 Xiaomi 扫地机器人、美容礼券及每周奖励。奖品须视供应情况而定，不可转让或兑换现金，除非 Mezzanail 另行书面确认。若因合理控制范围外的原因无法提供指定奖品，可提供合理相近价值的替代奖品。",
      },
      {
        title: "抽选与通知得主",
        body: "活动结束后，将从经核实且符合资格的参与资料中随机抽选得主。Mezzanail 会使用提交或会员资料中的联系方式通知得主，并可要求合理的身份、会员及参与证明。得主如在七天内没有回应，可能失去领奖资格，主办方可重新抽选得主。",
      },
      {
        title: "领奖与取消资格",
        body: "奖品领取或送达安排将直接确认。如发现欺诈、操纵、滥用、违反条款或无法提供合理核实资料，Mezzanail 可取消参与资格。在适用法律允许的范围内，主办方对核实及奖品管理的决定为最终决定。",
      },
      {
        title: "个人资料与公布",
        body: "个人资料将根据 Mezzanail 隐私政策，用于核实参与资格、管理抽奖、联系得主、发放奖品及保存可追溯的活动记录。公开公布得主时，仅会使用有限资料，例如名字与姓氏首字母，除非另行取得同意。",
      },
      {
        title: "更改、暂停或取消",
        body: "如欺诈、技术故障、法律要求或合理控制范围外的事件影响活动公平进行，Mezzanail 可作出合理必要的更改、暂停或取消活动。重要更改会公布在活动或条款页面。",
      },
      {
        title: "责任与奖品品牌",
        body: "本条款不排除依法不可排除的权利或责任。在法律允许的范围内，Mezzanail 不对间接损失或其合理控制范围外的第三方平台故障负责。奖品品牌名称与商标属于各自权利人；除非明确说明，本活动并非由这些品牌赞助或认可。",
      },
      {
        title: "语言与适用法律",
        body: "本条款受马来西亚法律管辖。英文、中文及马来文版本旨在表达相同条件；若出现无法解决的不一致，在法律允许的范围内以英文版本为准。",
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
    lastUpdatedDate: "27 Julai 2026",
    intro:
      "Terma ini mengawal Kempen Cabutan Bertuah Ulang Tahun Ke-7 Mezzanail. Dengan menghantar penyertaan, peserta mengesahkan maklumat adalah tepat dan bersetuju dengan terma ini.",
    sections: [
      {
        title: "Penganjur dan hubungan",
        body: "Penganjur ialah Mezzanail Nail Studio, 36-1, Jalan Seri 7, Taman Cheng Baru, 75260 Melaka, Malaysia. Pertanyaan kempen boleh dihantar melalui WhatsApp ke +60 16-2121 332.",
      },
      {
        title: "Tempoh kempen",
        body: "Kempen berlangsung dari 26 Julai hingga 30 September 2026, termasuk kedua-dua tarikh, berdasarkan waktu Malaysia. Penyertaan di luar tempoh tidak layak melainkan Mezzanail menerbitkan lanjutan.",
      },
      {
        title: "Kelayakan dan langkah penyertaan",
        body: "Pelanggan Mezzanail yang layak mesti menyertai keahlian Mezzanail, mengimbas QR rasmi atau membuka pautan rasmi kempen, berkongsi kempen dengan tiga rakan, dan melengkapkan penyertaan cabutan bertuah yang diminta studio. Janji temu tertakluk pada pengesahan. Tempahan atau perkongsian sahaja tidak menjamin penyertaan atau hadiah.",
      },
      {
        title: "Penyertaan sah",
        body: "Penyertaan mesti lengkap, tulen, boleh disahkan dan dipautkan kepada butiran hubungan peserta sendiri. Penyertaan berganda, automatik, diubah, tidak lengkap atau menipu boleh ditolak. Kod rujukan digunakan untuk atribusi kempen dan tidak menghasilkan kredit bonus, ganjaran atau penyertaan tambahan secara automatik.",
      },
      {
        title: "Hadiah",
        body: "Hadiah termasuk satu Dyson Supersonic™ Travel Hair Dryer, satu HUAWEI Watch Fit 5, satu Xiaomi Robot Vacuum, baucar kecantikan dan ganjaran mingguan. Hadiah tertakluk pada ketersediaan, tidak boleh dipindah milik atau ditukar dengan wang tunai kecuali disahkan secara bertulis. Jika hadiah tidak tersedia atas sebab di luar kawalan munasabah, hadiah gantian bernilai munasabah setanding boleh diberikan.",
      },
      {
        title: "Pemilihan dan pemberitahuan pemenang",
        body: "Pemenang akan dipilih melalui cabutan rawak daripada penyertaan layak yang disahkan selepas kempen tamat. Mezzanail akan menghubungi pemenang menggunakan butiran yang dihantar atau direkodkan dalam keahlian dan boleh meminta bukti identiti, keahlian serta penyertaan yang munasabah. Pemenang yang tidak menjawab dalam tujuh hari boleh kehilangan hadiah dan pemenang gantian boleh dipilih.",
      },
      {
        title: "Pengambilan dan pembatalan kelayakan",
        body: "Aturan pengambilan atau penghantaran hadiah akan disahkan secara langsung. Mezzanail boleh membatalkan penyertaan kerana penipuan, manipulasi, penyalahgunaan, pelanggaran terma atau kegagalan memberikan pengesahan munasabah. Keputusan penganjur mengenai pengesahan dan pentadbiran hadiah adalah muktamad tertakluk pada undang-undang.",
      },
      {
        title: "Data peribadi dan pengumuman",
        body: "Data peribadi digunakan untuk mengesahkan penyertaan, mentadbir cabutan, menghubungi pemenang, menyerahkan hadiah dan menyimpan rekod kempen di bawah Notis Privasi Mezzanail. Pengumuman awam pemenang hanya menggunakan maklumat terhad seperti nama pertama dan huruf awal, melainkan persetujuan lanjut diperoleh.",
      },
      {
        title: "Perubahan, penggantungan atau pembatalan",
        body: "Mezzanail boleh membuat perubahan yang munasabah perlu, menggantung atau membatalkan kempen jika penipuan, kegagalan teknikal, keperluan undang-undang atau peristiwa di luar kawalan munasabah menjejaskan operasi adil. Perubahan penting akan diterbitkan pada halaman kempen atau terma.",
      },
      {
        title: "Liabiliti dan jenama hadiah",
        body: "Tiada apa-apa dalam terma ini mengecualikan hak atau liabiliti yang tidak boleh dikecualikan secara sah. Setakat dibenarkan undang-undang, Mezzanail tidak bertanggungjawab atas kerugian tidak langsung atau kegagalan platform pihak ketiga di luar kawalan munasabah. Nama dan tanda dagangan jenama hadiah milik pemilik masing-masing; kempen tidak ditaja atau disokong oleh jenama tersebut melainkan dinyatakan.",
      },
      {
        title: "Bahasa dan undang-undang",
        body: "Terma ini dikawal oleh undang-undang Malaysia. Versi Inggeris, Cina dan Bahasa Melayu bertujuan menyampaikan syarat yang sama; jika percanggahan tidak dapat diselesaikan, versi Inggeris terpakai setakat dibenarkan undang-undang.",
      },
    ],
    returnCampaign: "Kembali ke Kempen",
    contact: "Hubungi Mezzanail",
  },
} as const;
