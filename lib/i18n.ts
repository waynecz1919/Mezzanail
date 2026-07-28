export type Locale = "en" | "zh" | "ms";

export const localeNames: Record<Locale, string> = { en: "EN", zh: "中文", ms: "BM" };

export const messages = {
  en: {
    nav: { benefits: "Benefits", rewards: "Rewards", birthday: "Birthday", referral: "Refer", faq: "FAQ", login: "Sign in" },
    hero: { eyebrow: "MEZZANAIL MEMBERSHIP", title: "Beauty, rewarded with intention.", body: "Mezzanail’s membership experience, designed around meaningful beauty privileges. Current balances, eligibility and validity are confirmed in the authorised member app or by our Melaka studio.", primary: "Open member access", secondary: "Explore membership", note: "Website examples are interface previews; your member record is the source of truth." },
    card: { label: "MEZZANAIL NAIL STUDIO REWARDS", tier: "MEMBER PREVIEW", member: "Sample interface", points: "—", pointsLabel: "BALANCE IN APP", status: "PREVIEW" },
    stats: { members: "Active members", rewards: "Rewards redeemed", rating: "Member rating", retention: "Renewal rate" },
    benefits: { eyebrow: "MEMBERSHIP, REFINED", title: "Privileges designed around you.", body: "Every benefit is practical, transparent and available when it matters.", items: [
      ["Membership balance", "Your current paid or stored membership balance, where applicable, is shown in the authorised member app."],
      ["Bonus Credit", "Any promotional bonus, its eligible use and validity are shown with the specific offer or member record."],
      ["Reward Credit", "Any earned reward balance and redemption conditions are confirmed in the authorised member app."],
      ["Product Voucher", "Product voucher value, eligible products and expiry are governed by the voucher shown in your account."],
      ["Birthday Benefit", "Availability and eligibility are shown in the member app or confirmed by the Melaka studio."],
      ["Member Pricing", "Current member prices and whether offers may be combined are stated with the applicable offer."]
    ]},
    rewards: { eyebrow: "REWARDS", title: "Value you can see.", body: "A clear reward balance, thoughtful redemptions and no clutter.", available: "Available rewards", cards: [
      ["Membership balance", "View your current record in the app", "Preview"], ["Available rewards", "Eligibility is confirmed in the app", "Preview"], ["Offer validity", "Check the specific reward or voucher terms", "Preview"]
    ]},
    timeline: { eyebrow: "HOW IT WORKS", title: "From visit to reward.", steps: [["01", "Join", "Create your secure member profile."], ["02", "Earn", "Collect credits through eligible visits."], ["03", "Choose", "Select a reward that matters to you."], ["04", "Enjoy", "Redeem in studio with your member ID."]]},
    birthday: { eyebrow: "BIRTHDAY BENEFIT", title: "A quieter kind of celebration.", body: "If a birthday benefit is available for your membership, its eligibility, booking window and validity will appear in the authorised member app or be confirmed by the studio.", cta: "Confirm with the studio" },
    monthly: { eyebrow: "CURRENT MEMBER OFFERS", title: "Member updates, clearly stated.", offer: "Check the authorised member app", detail: "Current offers, values, exclusions and validity are shown in the app or confirmed by the studio. Website previews do not create an entitlement.", terms: "Member terms apply", cta: "Book an appointment" },
    referral: { eyebrow: "REFERRAL INFORMATION", title: "Share exceptional care.", body: "Referral availability and any qualifying reward may change by campaign. Confirm the current published offer before referring a friend.", cta: "Ask the studio", copied: "Referral information" },
    testimonials: { eyebrow: "GOOGLE REVIEWS", title: "Read current customer feedback on our official Google listing." },
    faq: { eyebrow: "QUESTIONS", title: "Everything, clearly answered.", items: [["How do I join Mezzanail membership?", "Open member access online or ask the team at our Melaka studio to confirm the current joining process."], ["Do reward credits expire?", "Expiry rules, if any, are shown clearly beside each reward in your authorised member account."], ["Can I combine member offers?", "Offer combinations depend on the specific terms. Confirm eligibility before booking."], ["How does the birthday benefit work?", "Availability, eligibility and validity are shown in the authorised member app or confirmed by the studio."], ["Where can I get help?", "Use WhatsApp or contact our Melaka studio for assistance."]]},
    cta: { eyebrow: "YOUR MEMBERSHIP, READY", title: "Enter a more rewarding beauty experience.", primary: "Join Mezzanail Nail Studio Rewards", secondary: "WhatsApp us" },
    footer: { statement: "Mezzanail’s membership experience for our Melaka studio.", platform: "Membership", support: "Support", legal: "Privacy", terms: "Terms", contact: "Contact", location: "Melaka studio", copyright: "© 2026 Mezzanail Nail Studio. All rights reserved." },
    mobile: { home: "Home", rewards: "Rewards", member: "Member", contact: "Contact" },
    login: { back: "Back to home", eyebrow: "MEMBER ACCESS", title: "Welcome back.", body: "Sign in to view your rewards, membership status and exclusive offers.", email: "Email address", password: "Password", forgot: "Forgot password?", submit: "Sign in", new: "New to Mezzanail Nail Studio Rewards?", join: "Create membership", secure: "Secure member access" }
  },
  zh: {
    nav: { benefits: "会员权益", rewards: "Rewards", birthday: "生日礼遇", referral: "推荐好友", faq: "常见问题", login: "登录" },
    hero: { eyebrow: "MEZZANAIL 会员", title: "每一次美丽，都值得回馈。", body: "Mezzanail 会员体验围绕实用的美丽礼遇而设计。当前余额、资格与有效期请以授权会员 App 或 Melaka 门店确认为准。", primary: "打开会员入口", secondary: "了解会员体验", note: "网站内容为界面预览；实际会员记录以 App 或门店确认为准。" },
    card: { label: "MEZZANAIL NAIL STUDIO REWARDS", tier: "会员界面预览", member: "示例界面", points: "—", pointsLabel: "请在 APP 查看余额", status: "预览" },
    stats: { members: "活跃会员", rewards: "已兑换奖励", rating: "会员评分", retention: "续会率" },
    benefits: { eyebrow: "清楚说明的会员资料", title: "每一类余额，各有明确用途。", body: "网站只说明资料类别；实际金额、资格与有效期请以 App 或门店确认为准。", items: [["会员余额", "如适用，当前付费或储值会员余额显示于授权会员 App。"], ["Bonus Credit", "促销赠送额度、适用范围与有效期以相关优惠或会员记录为准。"], ["Reward Credit", "已获得的奖励额度及兑换条件以授权会员 App 为准。"], ["Product Voucher", "产品礼券金额、适用产品与有效期以账户中的礼券为准。"], ["生日礼遇", "是否提供及适用资格以会员 App 或 Melaka 门店确认为准。"], ["会员专价", "当前会员价格及优惠是否可叠加，以相关优惠条款为准。"]] },
    rewards: { eyebrow: "会员界面预览", title: "查看属于你的实际记录。", body: "网站不会显示或承诺未经确认的个人余额与可兑换礼遇。", available: "会员资料", cards: [["会员余额", "请在 App 查看当前记录", "预览"], ["可用奖励", "资格以 App 显示为准", "预览"], ["优惠有效期", "查看具体奖励或礼券条款", "预览"]] },
    timeline: { eyebrow: "使用方式", title: "从到店到领取奖励。", steps: [["01", "加入", "建立安全的会员账户。"], ["02", "累积", "符合条件的到店消费可获得奖励。"], ["03", "选择", "挑选真正适合你的奖励。"], ["04", "享用", "到店出示会员身份即可兑换。"]] },
    birthday: { eyebrow: "生日礼遇", title: "低调而精致的庆祝方式。", body: "如会员配套提供生日礼遇，其资格、预约时间与有效期会显示于授权会员 App，或由门店确认。", cta: "向门店确认" },
    monthly: { eyebrow: "当前会员优惠", title: "会员更新，清楚说明。", offer: "请查看授权会员 App", detail: "当前优惠、金额、限制与有效期以 App 或门店确认为准。网站预览不会自动产生权益。", terms: "须符合会员条款", cta: "预约服务" },
    referral: { eyebrow: "推荐资料", title: "分享值得信赖的护理。", body: "推荐活动及合资格奖励可能随活动调整。推荐好友前，请先确认当前已公布的优惠。", cta: "向门店查询", copied: "推荐资料" },
    testimonials: { eyebrow: "GOOGLE 评价", title: "前往官方 Google 商家页面阅读顾客最新评价。" },
    faq: { eyebrow: "常见问题", title: "重要信息，清楚说明。", items: [["如何加入 Mezzanail 会员？", "可打开线上会员入口，或向 Melaka 门店团队确认当前加入方式。"], ["奖励额度会过期吗？", "如设有效期，授权会员账户会在相关奖励旁清楚显示。"], ["会员优惠可以同时使用吗？", "须视具体优惠条款而定，请在预约前确认。"], ["生日礼遇如何使用？", "是否提供、适用资格与有效期以会员 App 或门店确认为准。"], ["需要协助怎么办？", "可通过 WhatsApp 或联系 Mezzanail Melaka 门店。"]] },
    cta: { eyebrow: "专属体验已经准备好", title: "进入更值得回馈的美甲体验。", primary: "加入 Mezzanail Nail Studio Rewards", secondary: "WhatsApp 咨询" },
    footer: { statement: "为 Melaka 门店顾客设计的 Mezzanail 会员体验。", platform: "会员", support: "客户支持", legal: "隐私政策", terms: "使用条款", contact: "联系我们", location: "Melaka 门店", copyright: "© 2026 Mezzanail Nail Studio。保留所有权利。" },
    mobile: { home: "首页", rewards: "奖励", member: "会员", contact: "联系" },
    login: { back: "返回首页", eyebrow: "会员登录", title: "欢迎回来。", body: "登录查看奖励、会员状态及专属优惠。", email: "电子邮件", password: "密码", forgot: "忘记密码？", submit: "登录", new: "还不是 Mezzanail Nail Studio Rewards 会员？", join: "建立会员账户", secure: "安全会员登录" }
  },
  ms: {
    nav: { benefits: "Keistimewaan", rewards: "Ganjaran", birthday: "Hari Jadi", referral: "Rujuk Rakan", faq: "Soalan Lazim", login: "Log masuk" },
    hero: { eyebrow: "KEAHLIAN MEZZANAIL", title: "Kecantikan yang dihargai dengan teliti.", body: "Pengalaman keahlian Mezzanail direka dengan keistimewaan kecantikan yang bermakna. Baki, kelayakan dan tempoh sah semasa disahkan dalam aplikasi ahli atau oleh studio Melaka.", primary: "Buka akses ahli", secondary: "Teroka keahlian", note: "Kandungan laman ialah pratonton antara muka; rekod ahli sebenar adalah muktamad." },
    card: { label: "MEZZANAIL NAIL STUDIO REWARDS", tier: "PRATONTON AHLI", member: "Antara muka contoh", points: "—", pointsLabel: "BAKI DALAM APLIKASI", status: "PRATONTON" },
    stats: { members: "Ahli aktif", rewards: "Ganjaran ditebus", rating: "Penilaian ahli", retention: "Kadar pembaharuan" },
    benefits: { eyebrow: "MAKLUMAT AHLI YANG JELAS", title: "Setiap jenis baki mempunyai tujuan tersendiri.", body: "Laman menerangkan kategori sahaja; amaun, kelayakan dan tempoh sah sebenar disahkan dalam aplikasi atau oleh studio.", items: [["Baki keahlian", "Baki keahlian berbayar atau tersimpan, jika berkenaan, dipaparkan dalam aplikasi ahli."], ["Bonus Credit", "Bonus promosi, kegunaan layak dan tempoh sah ditunjukkan bersama tawaran atau rekod ahli."], ["Reward Credit", "Baki ganjaran dan syarat penebusan disahkan dalam aplikasi ahli."], ["Product Voucher", "Nilai baucar produk, produk layak dan tarikh luput mengikut baucar dalam akaun."], ["Manfaat hari jadi", "Ketersediaan dan kelayakan disahkan dalam aplikasi atau oleh studio Melaka."], ["Harga ahli", "Harga ahli semasa dan gabungan tawaran tertakluk pada tawaran berkenaan."]] },
    rewards: { eyebrow: "PRATONTON ANTARA MUKA", title: "Lihat rekod sebenar anda.", body: "Laman tidak memaparkan atau menjanjikan baki peribadi dan ganjaran yang belum disahkan.", available: "Maklumat ahli", cards: [["Baki keahlian", "Lihat rekod semasa dalam aplikasi", "Pratonton"], ["Ganjaran tersedia", "Kelayakan disahkan dalam aplikasi", "Pratonton"], ["Tempoh sah tawaran", "Semak terma ganjaran atau baucar", "Pratonton"]] },
    timeline: { eyebrow: "CARA IA BERFUNGSI", title: "Daripada kunjungan kepada ganjaran.", steps: [["01", "Sertai", "Cipta profil ahli yang selamat."], ["02", "Kumpul", "Dapatkan kredit melalui kunjungan layak."], ["03", "Pilih", "Pilih ganjaran yang bermakna untuk anda."], ["04", "Nikmati", "Tebus di studio dengan ID ahli."]] },
    birthday: { eyebrow: "MANFAAT HARI JADI", title: "Cara sambutan yang lebih tenang.", body: "Jika manfaat hari jadi tersedia, kelayakan, tempoh tempahan dan tempoh sah akan dipaparkan dalam aplikasi ahli atau disahkan oleh studio.", cta: "Sahkan dengan studio" },
    monthly: { eyebrow: "TAWARAN AHLI SEMASA", title: "Kemas kini ahli yang jelas.", offer: "Semak aplikasi ahli", detail: "Tawaran, nilai, pengecualian dan tempoh sah semasa ditunjukkan dalam aplikasi atau disahkan oleh studio. Pratonton laman tidak mewujudkan kelayakan.", terms: "Tertakluk pada terma ahli", cta: "Tempah janji temu" },
    referral: { eyebrow: "MAKLUMAT RUJUKAN", title: "Kongsi penjagaan berkualiti.", body: "Ketersediaan rujukan dan ganjaran layak boleh berubah mengikut kempen. Sahkan tawaran semasa sebelum merujuk rakan.", cta: "Tanya studio", copied: "Maklumat rujukan" },
    testimonials: { eyebrow: "ULASAN GOOGLE", title: "Baca maklum balas pelanggan terkini pada penyenaraian Google rasmi kami." },
    faq: { eyebrow: "SOALAN", title: "Semuanya dijawab dengan jelas.", items: [["Bagaimana saya menyertai keahlian Mezzanail?", "Buka akses ahli dalam talian atau tanya pasukan di studio Melaka tentang proses semasa."], ["Adakah kredit ganjaran akan luput?", "Jika berkenaan, tarikh luput dipaparkan pada setiap ganjaran dalam akaun ahli."], ["Bolehkah tawaran ahli digabungkan?", "Gabungan bergantung pada terma khusus. Sahkan kelayakan sebelum menempah."], ["Bagaimana manfaat hari jadi berfungsi?", "Ketersediaan, kelayakan dan tempoh sah disahkan dalam aplikasi ahli atau oleh studio."], ["Di mana saya boleh mendapatkan bantuan?", "Gunakan WhatsApp atau hubungi studio Melaka kami."]] },
    cta: { eyebrow: "KEAHLIAN ANDA SEDIA", title: "Masuki pengalaman kecantikan yang lebih bermakna.", primary: "Sertai Mezzanail Nail Studio Rewards", secondary: "WhatsApp kami" },
    footer: { statement: "Pengalaman keahlian Mezzanail untuk studio Melaka kami.", platform: "Keahlian", support: "Sokongan", legal: "Privasi", terms: "Terma", contact: "Hubungi", location: "Studio Melaka", copyright: "© 2026 Mezzanail Nail Studio. Hak cipta terpelihara." },
    mobile: { home: "Utama", rewards: "Ganjaran", member: "Ahli", contact: "Hubungi" },
    login: { back: "Kembali", eyebrow: "AKSES AHLI", title: "Selamat kembali.", body: "Log masuk untuk melihat ganjaran, status keahlian dan tawaran eksklusif.", email: "Alamat e-mel", password: "Kata laluan", forgot: "Lupa kata laluan?", submit: "Log masuk", new: "Baharu di Mezzanail Nail Studio Rewards?", join: "Cipta keahlian", secure: "Akses ahli selamat" }
  }
} as const;

export type Dictionary = (typeof messages)[Locale];
