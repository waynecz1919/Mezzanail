export type Locale = "en" | "zh" | "ms";

export const localeNames: Record<Locale, string> = { en: "EN", zh: "中文", ms: "BM" };

export const messages = {
  en: {
    nav: { benefits: "Benefits", rewards: "Rewards", birthday: "Birthday", referral: "Refer", faq: "FAQ", login: "Sign in" },
    hero: { eyebrow: "THE NEW STANDARD OF NAIL MEMBERSHIP", title: "Beauty, rewarded with intention.", body: "Mezzanail Nail Studio Rewards is Malaysia’s premium nail membership platform—created for members who value exceptional care, meaningful privileges and effortless access.", primary: "Become a member", secondary: "Explore privileges", note: "Membership without the noise. Benefits with real value." },
    card: { label: "MEZZANAIL NAIL STUDIO REWARDS", tier: "BLACK MEMBER", member: "Member since 2026", points: "2,480", pointsLabel: "REWARD POINTS", status: "ACTIVE" },
    stats: { members: "Active members", rewards: "Rewards redeemed", rating: "Member rating", retention: "Renewal rate" },
    benefits: { eyebrow: "MEMBERSHIP, REFINED", title: "Privileges designed around you.", body: "Every benefit is practical, transparent and available when it matters.", items: [
      ["Priority booking", "Preferred appointment access across participating Mezzanail Nail Studio studios."],
      ["Birthday ritual", "A considered birthday-month treatment reserved for members."],
      ["Member pricing", "Exclusive monthly offers without confusing tiers or hidden conditions."],
      ["Reward credits", "Earn credits through visits, referrals and selected anniversary campaigns."],
      ["Family sharing", "Share selected privileges with the people closest to you."],
      ["No expiry pressure", "A membership experience built for long-term value, not urgency."]
    ]},
    rewards: { eyebrow: "REWARDS", title: "Value you can see.", body: "A clear reward balance, thoughtful redemptions and no clutter.", available: "Available rewards", cards: [
      ["RM50 service credit", "500 points", "Redeem"], ["Signature care upgrade", "800 points", "Redeem"], ["Birthday add-on", "Member exclusive", "View"]
    ]},
    timeline: { eyebrow: "HOW IT WORKS", title: "From visit to reward.", steps: [["01", "Join", "Create your secure member profile."], ["02", "Earn", "Collect credits through eligible visits."], ["03", "Choose", "Select a reward that matters to you."], ["04", "Enjoy", "Redeem in studio with your member ID."]]},
    birthday: { eyebrow: "BIRTHDAY PRIVILEGE", title: "A quieter kind of celebration.", body: "During your birthday month, enjoy a member-only nail care ritual prepared with the same attention we bring to every appointment.", cta: "View birthday benefit" },
    monthly: { eyebrow: "THIS MONTH", title: "Member-exclusive edit.", offer: "Complimentary colour-gel refresh", detail: "Available with selected manicure services for active members this month.", terms: "Member terms apply", cta: "Reserve your appointment" },
    referral: { eyebrow: "REFER A FRIEND", title: "Share exceptional care.", body: "Invite a friend to Mezzanail Nail Studio Rewards. When they activate a qualifying membership, you both receive a reward credit.", cta: "Copy referral link", copied: "Referral link copied" },
    testimonials: { eyebrow: "MEMBER NOTES", title: "Trusted by members who notice the details.", cards: [["The benefits are clear, useful and never feel promotional.", "Alicia T.", "Black Member"], ["Booking and redeeming rewards takes less than a minute.", "Nur A.", "Gold Member"], ["It feels more like a premium service than a points programme.", "Mei Lin C.", "Black Member"]]},
    faq: { eyebrow: "QUESTIONS", title: "Everything, clearly answered.", items: [["How do I join Mezzanail Nail Studio Rewards?", "Create an account online or ask a team member at a participating Mezzanail Nail Studio."], ["Do reward credits expire?", "Expiry rules, if any, are shown clearly beside each reward in your account."], ["Can I combine member offers?", "Offer combinations depend on the individual promotion and are always shown before booking."], ["How does the birthday benefit work?", "Eligible active members receive the birthday offer in their account during their birthday month."], ["Where can I get help?", "Use WhatsApp or contact your preferred Mezzanail Nail Studio for assistance."]]},
    cta: { eyebrow: "YOUR MEMBERSHIP, READY", title: "Enter a more rewarding beauty experience.", primary: "Join Mezzanail Nail Studio Rewards", secondary: "WhatsApp us" },
    footer: { statement: "Malaysia’s premium nail membership platform.", platform: "Platform", support: "Support", legal: "Privacy", terms: "Terms", contact: "Contact", location: "Studio locations", copyright: "© 2026 Mezzanail Nail Studio. All rights reserved." },
    mobile: { home: "Home", rewards: "Rewards", member: "Member", contact: "Contact" },
    login: { back: "Back to home", eyebrow: "MEMBER ACCESS", title: "Welcome back.", body: "Sign in to view your rewards, membership status and exclusive offers.", email: "Email address", password: "Password", forgot: "Forgot password?", submit: "Sign in", new: "New to Mezzanail Nail Studio Rewards?", join: "Create membership", secure: "Secure member access" }
  },
  zh: {
    nav: { benefits: "会员权益", rewards: "Rewards", birthday: "生日礼遇", referral: "推荐好友", faq: "常见问题", login: "登录" },
    hero: { eyebrow: "美甲会员体验的新标准", title: "每一次美丽，都值得回馈。", body: "Mezzanail Nail Studio Rewards 是马来西亚的高级美甲会员平台，为重视专业护理、实际权益与便捷体验的会员而设。", primary: "加入会员", secondary: "查看会员权益", note: "不喧哗的会员制度，真正有价值的专属礼遇。" },
    card: { label: "MEZZANAIL NAIL STUDIO REWARDS", tier: "黑卡会员", member: "会员始于 2026", points: "2,480", pointsLabel: "奖励积分", status: "有效" },
    stats: { members: "活跃会员", rewards: "已兑换奖励", rating: "会员评分", retention: "续会率" },
    benefits: { eyebrow: "精心设计的会员制度", title: "围绕你的需求而设。", body: "每项权益都实用、透明，并在真正需要时随时可用。", items: [["优先预约", "优先选择参与门店的理想预约时段。"], ["生日礼遇", "生日月享会员专属护理体验。"], ["会员专价", "每月专属优惠，条件清晰、不设隐藏门槛。"], ["奖励额度", "通过合资格消费、推荐与指定活动累积奖励。"], ["家庭共享", "与亲近家人共享指定会员权益。"], ["无到期压力", "为长期价值而设计，而非制造使用焦虑。"]] },
    rewards: { eyebrow: "奖励中心", title: "看得见的会员价值。", body: "余额清晰、兑换简单，只保留真正值得的奖励。", available: "可兑换奖励", cards: [["RM50 服务额度", "500 积分", "兑换"], ["招牌护理升级", "800 积分", "兑换"], ["生日护理升级", "会员专属", "查看"]] },
    timeline: { eyebrow: "使用方式", title: "从到店到领取奖励。", steps: [["01", "加入", "建立安全的会员账户。"], ["02", "累积", "符合条件的到店消费可获得奖励。"], ["03", "选择", "挑选真正适合你的奖励。"], ["04", "享用", "到店出示会员身份即可兑换。"]] },
    birthday: { eyebrow: "生日礼遇", title: "低调而精致的庆祝方式。", body: "生日月期间，会员可享专属美甲护理礼遇，延续 Mezzanail Nail Studio 对每次服务的细致标准。", cta: "查看生日礼遇" },
    monthly: { eyebrow: "本月专属", title: "会员限定精选。", offer: "免费色胶焕新", detail: "本月有效会员选择指定美甲服务即可享用。", terms: "须符合会员条款", cta: "预约服务" },
    referral: { eyebrow: "推荐好友", title: "分享值得信赖的护理。", body: "邀请好友加入 Mezzanail Nail Studio Rewards。好友成功开通合资格会员后，双方均可获得奖励额度。", cta: "复制推荐链接", copied: "推荐链接已复制" },
    testimonials: { eyebrow: "会员评价", title: "获得重视细节的会员信赖。", cards: [["权益清楚而实用，不会让人觉得一直被推销。", "Alicia T.", "黑卡会员"], ["预约和兑换奖励，不到一分钟就能完成。", "Nur A.", "金卡会员"], ["体验更像高级服务，而不只是积分计划。", "Mei Lin C.", "黑卡会员"]] },
    faq: { eyebrow: "常见问题", title: "重要信息，清楚说明。", items: [["如何加入 Mezzanail Nail Studio Rewards？", "可在线建立账户，或向参与门店的 Mezzanail Nail Studio 团队查询。"], ["奖励额度会过期吗？", "如设有效期，系统会在相关奖励旁清楚显示。"], ["会员优惠可以同时使用吗？", "视个别活动条款而定，预约前会清楚说明。"], ["生日礼遇如何使用？", "符合资格的有效会员会在生日月于账户内收到专属礼遇。"], ["需要协助怎么办？", "可通过 WhatsApp 或联系常去的 Mezzanail Nail Studio 门店。"]] },
    cta: { eyebrow: "专属体验已经准备好", title: "进入更值得回馈的美甲体验。", primary: "加入 Mezzanail Nail Studio Rewards", secondary: "WhatsApp 咨询" },
    footer: { statement: "马来西亚高级美甲会员平台。", platform: "会员平台", support: "客户支持", legal: "隐私政策", terms: "使用条款", contact: "联系我们", location: "门店地点", copyright: "© 2026 Mezzanail Nail Studio。保留所有权利。" },
    mobile: { home: "首页", rewards: "奖励", member: "会员", contact: "联系" },
    login: { back: "返回首页", eyebrow: "会员登录", title: "欢迎回来。", body: "登录查看奖励、会员状态及专属优惠。", email: "电子邮件", password: "密码", forgot: "忘记密码？", submit: "登录", new: "还不是 Mezzanail Nail Studio Rewards 会员？", join: "建立会员账户", secure: "安全会员登录" }
  },
  ms: {
    nav: { benefits: "Keistimewaan", rewards: "Ganjaran", birthday: "Hari Jadi", referral: "Rujuk Rakan", faq: "Soalan Lazim", login: "Log masuk" },
    hero: { eyebrow: "STANDARD BAHARU KEAHLIAN KUKU", title: "Kecantikan yang dihargai dengan teliti.", body: "Mezzanail Nail Studio Rewards ialah platform keahlian kuku premium Malaysia—untuk ahli yang menghargai penjagaan berkualiti, keistimewaan bermakna dan akses mudah.", primary: "Jadi ahli", secondary: "Lihat keistimewaan", note: "Keahlian tanpa kekecohan. Manfaat dengan nilai sebenar." },
    card: { label: "MEZZANAIL NAIL STUDIO REWARDS", tier: "AHLI BLACK", member: "Ahli sejak 2026", points: "2,480", pointsLabel: "MATA GANJARAN", status: "AKTIF" },
    stats: { members: "Ahli aktif", rewards: "Ganjaran ditebus", rating: "Penilaian ahli", retention: "Kadar pembaharuan" },
    benefits: { eyebrow: "KEAHLIAN YANG DIPERHALUS", title: "Keistimewaan untuk keperluan anda.", body: "Setiap manfaat praktikal, telus dan tersedia apabila diperlukan.", items: [["Tempahan keutamaan", "Akses masa pilihan di studio Mezzanail Nail Studio yang mengambil bahagian."], ["Ritual hari jadi", "Rawatan bulan hari jadi khas untuk ahli."], ["Harga ahli", "Tawaran bulanan eksklusif tanpa syarat yang mengelirukan."], ["Kredit ganjaran", "Kumpul kredit melalui kunjungan, rujukan dan kempen terpilih."], ["Perkongsian keluarga", "Kongsi keistimewaan terpilih dengan insan terdekat."], ["Tiada tekanan luput", "Pengalaman keahlian untuk nilai jangka panjang."]] },
    rewards: { eyebrow: "GANJARAN", title: "Nilai yang boleh dilihat.", body: "Baki jelas, penebusan bermakna dan tanpa kekusutan.", available: "Ganjaran tersedia", cards: [["Kredit servis RM50", "500 mata", "Tebus"], ["Naik taraf penjagaan signature", "800 mata", "Tebus"], ["Tambahan hari jadi", "Eksklusif ahli", "Lihat"]] },
    timeline: { eyebrow: "CARA IA BERFUNGSI", title: "Daripada kunjungan kepada ganjaran.", steps: [["01", "Sertai", "Cipta profil ahli yang selamat."], ["02", "Kumpul", "Dapatkan kredit melalui kunjungan layak."], ["03", "Pilih", "Pilih ganjaran yang bermakna untuk anda."], ["04", "Nikmati", "Tebus di studio dengan ID ahli."]] },
    birthday: { eyebrow: "KEISTIMEWAAN HARI JADI", title: "Cara sambutan yang lebih tenang.", body: "Pada bulan hari jadi, nikmati ritual penjagaan kuku khas ahli dengan perhatian yang sama pada setiap janji temu.", cta: "Lihat manfaat hari jadi" },
    monthly: { eyebrow: "BULAN INI", title: "Pilihan eksklusif ahli.", offer: "Penyegaran gel warna percuma", detail: "Tersedia dengan servis manicure terpilih untuk ahli aktif bulan ini.", terms: "Tertakluk pada syarat ahli", cta: "Tempah janji temu" },
    referral: { eyebrow: "RUJUK RAKAN", title: "Kongsi penjagaan berkualiti.", body: "Jemput rakan ke Mezzanail Nail Studio Rewards. Apabila mereka mengaktifkan keahlian yang layak, anda berdua menerima kredit ganjaran.", cta: "Salin pautan rujukan", copied: "Pautan rujukan disalin" },
    testimonials: { eyebrow: "NOTA AHLI", title: "Dipercayai ahli yang menghargai perincian.", cards: [["Manfaatnya jelas, berguna dan tidak terasa seperti promosi.", "Alicia T.", "Ahli Black"], ["Tempahan dan penebusan ganjaran mengambil masa kurang seminit.", "Nur A.", "Ahli Gold"], ["Rasanya lebih seperti servis premium daripada program mata.", "Mei Lin C.", "Ahli Black"]] },
    faq: { eyebrow: "SOALAN", title: "Semuanya dijawab dengan jelas.", items: [["Bagaimana saya menyertai Mezzanail Nail Studio Rewards?", "Cipta akaun dalam talian atau tanya pasukan di Mezzanail Nail Studio yang mengambil bahagian."], ["Adakah kredit ganjaran akan luput?", "Jika berkenaan, tarikh luput dipaparkan dengan jelas pada setiap ganjaran."], ["Bolehkah tawaran ahli digabungkan?", "Gabungan bergantung pada promosi dan ditunjukkan sebelum tempahan."], ["Bagaimana manfaat hari jadi berfungsi?", "Ahli aktif yang layak menerima tawaran dalam akaun pada bulan hari jadi."], ["Di mana saya boleh mendapatkan bantuan?", "Gunakan WhatsApp atau hubungi Mezzanail Nail Studio pilihan anda."]] },
    cta: { eyebrow: "KEAHLIAN ANDA SEDIA", title: "Masuki pengalaman kecantikan yang lebih bermakna.", primary: "Sertai Mezzanail Nail Studio Rewards", secondary: "WhatsApp kami" },
    footer: { statement: "Platform keahlian kuku premium Malaysia.", platform: "Platform", support: "Sokongan", legal: "Privasi", terms: "Terma", contact: "Hubungi", location: "Lokasi studio", copyright: "© 2026 Mezzanail Nail Studio. Hak cipta terpelihara." },
    mobile: { home: "Utama", rewards: "Ganjaran", member: "Ahli", contact: "Hubungi" },
    login: { back: "Kembali", eyebrow: "AKSES AHLI", title: "Selamat kembali.", body: "Log masuk untuk melihat ganjaran, status keahlian dan tawaran eksklusif.", email: "Alamat e-mel", password: "Kata laluan", forgot: "Lupa kata laluan?", submit: "Log masuk", new: "Baharu di Mezzanail Nail Studio Rewards?", join: "Cipta keahlian", secure: "Akses ahli selamat" }
  }
} as const;

export type Dictionary = (typeof messages)[Locale];
