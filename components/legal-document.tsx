import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { AnalyticsSettingsButton } from "@/components/analytics-settings-button";
import { OfficialFrame } from "@/components/official-site";
import { siteConfig } from "@/lib/site";

export type LegalDocumentKind =
  | "privacy"
  | "terms"
  | "job-privacy"
  | "membership-terms"
  | "cookies";

type LanguageSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalSection = {
  en: LanguageSection;
  ms: LanguageSection;
};

type LegalDocument = {
  eyebrow: string;
  title: string;
  titleMs: string;
  updated: string;
  introEn: string;
  introMs: string;
  sections: LegalSection[];
};

const retentionEn = [
  "General enquiries and service correspondence: up to 12 months after the last interaction.",
  "Booking, payment and transaction records: up to 7 years where needed for accounting, tax, dispute or legal purposes.",
  "Membership profile and service history: while the membership is active and up to 24 months afterwards; transaction records may be retained for up to 7 years.",
  "Promotion entries and winner administration: up to 12 months after prizes are fulfilled.",
  "Job applications: normally 12 months from submission for unsuccessful applicants; hired applicants’ relevant records become employment records.",
  "Security and rate-limiting records: normally up to 90 days, unless needed to investigate abuse or protect legal rights.",
  "Google Analytics user and event data: up to 14 months; aggregated reports may remain longer without directly identifying a visitor.",
];

const retentionMs = [
  "Pertanyaan umum dan surat-menyurat perkhidmatan: sehingga 12 bulan selepas interaksi terakhir.",
  "Rekod tempahan, pembayaran dan transaksi: sehingga 7 tahun jika diperlukan bagi tujuan perakaunan, cukai, pertikaian atau undang-undang.",
  "Profil keahlian dan sejarah perkhidmatan: sepanjang keahlian aktif dan sehingga 24 bulan selepasnya; rekod transaksi boleh disimpan sehingga 7 tahun.",
  "Penyertaan promosi dan pengurusan pemenang: sehingga 12 bulan selepas hadiah disempurnakan.",
  "Permohonan kerja: lazimnya 12 bulan dari tarikh permohonan bagi pemohon yang tidak berjaya; rekod berkaitan pemohon yang diambil bekerja menjadi rekod pekerjaan.",
  "Rekod keselamatan dan had kadar: lazimnya sehingga 90 hari, melainkan diperlukan untuk menyiasat penyalahgunaan atau melindungi hak undang-undang.",
  "Data pengguna dan peristiwa Google Analytics: sehingga 14 bulan; laporan agregat boleh disimpan lebih lama tanpa mengenal pasti pelawat secara langsung.",
];

const privacyDocument: LegalDocument = {
  eyebrow: "PERSONAL DATA PROTECTION NOTICE",
  title: "Privacy Policy",
  titleMs: "Notis Privasi",
  updated: "27 July 2026",
  introEn:
    "This notice explains how Mezzanail Nail Studio collects, uses, discloses, stores and protects personal data in connection with our website, studio services, bookings, membership and promotions. It is intended to provide notice and choice under Malaysia’s Personal Data Protection Act 2010 (Act 709), as amended.",
  introMs:
    "Notis ini menerangkan cara Mezzanail Nail Studio mengumpul, menggunakan, mendedahkan, menyimpan dan melindungi data peribadi berkaitan laman web, perkhidmatan studio, tempahan, keahlian dan promosi kami. Notis ini bertujuan memberi notis dan pilihan di bawah Akta Perlindungan Data Peribadi 2010 (Akta 709), sebagaimana dipinda.",
  sections: [
    {
      en: {
        heading: "1. Who we are",
        paragraphs: [
          `The data controller is Mezzanail Nail Studio, located at ${siteConfig.address.singleLine}. You may contact us by WhatsApp at ${siteConfig.mobileDisplay}, by telephone at ${siteConfig.phoneDisplay}, or in writing at the studio address.`,
        ],
      },
      ms: {
        heading: "1. Siapa kami",
        paragraphs: [
          `Pengawal data ialah Mezzanail Nail Studio yang beralamat di ${siteConfig.address.singleLine}. Anda boleh menghubungi kami melalui WhatsApp di ${siteConfig.mobileDisplay}, telefon di ${siteConfig.phoneDisplay}, atau secara bertulis ke alamat studio.`,
        ],
      },
    },
    {
      en: {
        heading: "2. Personal data we collect",
        bullets: [
          "Identity and contact details, such as your name, phone number, WhatsApp number and contact preferences.",
          "Booking, service, membership, payment and transaction information supplied to us or our booking and membership providers.",
          "Promotion participation, referral or source codes, prize fulfilment details and related communications.",
          "Messages, feedback, reviews and other information you choose to send to us.",
          "Technical data such as IP address, device and browser information, page activity, approximate location, security events and analytics identifiers when analytics is accepted.",
          "Recruitment information is covered separately by our Job Applicant Privacy Notice.",
        ],
      },
      ms: {
        heading: "2. Data peribadi yang kami kumpul",
        bullets: [
          "Butiran identiti dan hubungan seperti nama, nombor telefon, nombor WhatsApp dan pilihan hubungan.",
          "Maklumat tempahan, perkhidmatan, keahlian, pembayaran dan transaksi yang diberi kepada kami atau penyedia tempahan dan keahlian kami.",
          "Penyertaan promosi, kod rujukan atau sumber, butiran penyerahan hadiah dan komunikasi berkaitan.",
          "Mesej, maklum balas, ulasan dan maklumat lain yang anda pilih untuk dihantar kepada kami.",
          "Data teknikal seperti alamat IP, maklumat peranti dan pelayar, aktiviti halaman, lokasi anggaran, peristiwa keselamatan dan pengecam analitik apabila analitik diterima.",
          "Maklumat pengambilan pekerja diterangkan secara berasingan dalam Notis Privasi Pemohon Kerja.",
        ],
      },
    },
    {
      en: {
        heading: "3. Why we process it",
        bullets: [
          "To respond to enquiries, arrange and deliver appointments and studio services.",
          "To administer membership, rewards, promotions, referrals and prize fulfilment.",
          "To maintain transaction, customer service and business records.",
          "To secure the website, prevent misuse, investigate errors and enforce applicable terms.",
          "With your choice, to understand website use and improve content and services through analytics.",
          "To comply with law, regulatory requests and the establishment, exercise or defence of legal claims.",
        ],
      },
      ms: {
        heading: "3. Tujuan pemprosesan",
        bullets: [
          "Untuk menjawab pertanyaan, mengatur dan menyediakan janji temu serta perkhidmatan studio.",
          "Untuk mentadbir keahlian, ganjaran, promosi, rujukan dan penyerahan hadiah.",
          "Untuk menyelenggara rekod transaksi, khidmat pelanggan dan perniagaan.",
          "Untuk melindungi laman web, mencegah penyalahgunaan, menyiasat ralat dan menguatkuasakan terma yang berkenaan.",
          "Dengan pilihan anda, untuk memahami penggunaan laman web dan menambah baik kandungan serta perkhidmatan melalui analitik.",
          "Untuk mematuhi undang-undang, permintaan pengawal selia dan penubuhan, pelaksanaan atau pembelaan tuntutan undang-undang.",
        ],
      },
    },
    {
      en: {
        heading: "4. Sources and required information",
        paragraphs: [
          "We usually receive data directly from you, your device, a person acting with your authority, or service providers you use to book, join, communicate or participate. Fields marked as required are needed to complete the relevant request. If they are not provided, we may be unable to confirm a booking, membership, promotion entry or other service.",
        ],
      },
      ms: {
        heading: "4. Sumber dan maklumat wajib",
        paragraphs: [
          "Kami biasanya menerima data terus daripada anda, peranti anda, orang yang bertindak dengan kebenaran anda, atau penyedia yang anda gunakan untuk membuat tempahan, menyertai keahlian, berkomunikasi atau mengambil bahagian. Medan bertanda wajib diperlukan untuk melengkapkan permintaan berkenaan. Jika tidak diberikan, kami mungkin tidak dapat mengesahkan tempahan, keahlian, penyertaan promosi atau perkhidmatan lain.",
        ],
      },
    },
    {
      en: {
        heading: "5. Disclosure and overseas processing",
        paragraphs: [
          "We disclose data only where reasonably necessary to our authorised staff and providers supporting bookings and membership (including Tunai), website hosting (Vercel), analytics (Google, only after consent), communications (including WhatsApp/Meta), cloud database and email delivery, payment or professional services. Providers may process data outside Malaysia. We require purpose limitation and reasonable safeguards and do not sell personal data.",
        ],
      },
      ms: {
        heading: "5. Pendedahan dan pemprosesan di luar negara",
        paragraphs: [
          "Kami mendedahkan data hanya apabila munasabah diperlukan kepada kakitangan yang diberi kuasa dan penyedia yang menyokong tempahan dan keahlian (termasuk Tunai), pengehosan laman web (Vercel), analitik (Google, hanya selepas persetujuan), komunikasi (termasuk WhatsApp/Meta), pangkalan data awan dan penghantaran e-mel, pembayaran atau perkhidmatan profesional. Penyedia mungkin memproses data di luar Malaysia. Kami menghendaki had tujuan dan perlindungan munasabah serta tidak menjual data peribadi.",
        ],
      },
    },
    {
      en: {
        heading: "6. Retention",
        paragraphs: [
          "We keep personal data only for as long as needed for the stated purpose, then delete, anonymise or securely dispose of it. Our standard maximum periods are:",
        ],
        bullets: retentionEn,
      },
      ms: {
        heading: "6. Tempoh penyimpanan",
        paragraphs: [
          "Kami menyimpan data peribadi hanya selama diperlukan bagi tujuan yang dinyatakan, kemudian memadam, menganonimkan atau melupuskannya dengan selamat. Tempoh maksimum standard kami ialah:",
        ],
        bullets: retentionMs,
      },
    },
    {
      en: {
        heading: "7. Security",
        paragraphs: [
          "We use access controls, encrypted transport, restricted server-side configuration, data minimisation and operational safeguards appropriate to the data. No internet transmission or storage system can be guaranteed completely secure.",
        ],
      },
      ms: {
        heading: "7. Keselamatan",
        paragraphs: [
          "Kami menggunakan kawalan akses, penghantaran disulitkan, konfigurasi pelayan terhad, peminimuman data dan perlindungan operasi yang sesuai. Tiada sistem penghantaran atau penyimpanan internet yang boleh dijamin selamat sepenuhnya.",
        ],
      },
    },
    {
      en: {
        heading: "8. Your rights and choices",
        bullets: [
          "Ask whether we hold your personal data and request access to it.",
          "Request correction of inaccurate, incomplete, misleading or outdated data.",
          "Withdraw consent where processing depends on consent.",
          "Object to direct marketing or processing likely to cause damage or distress.",
          "Request deletion or restriction where the data is no longer needed, subject to legal and operational exceptions.",
          "Change your analytics choice at any time on the Cookies & Analytics page.",
        ],
      },
      ms: {
        heading: "8. Hak dan pilihan anda",
        bullets: [
          "Bertanya sama ada kami memegang data peribadi anda dan meminta akses kepadanya.",
          "Meminta pembetulan data yang tidak tepat, tidak lengkap, mengelirukan atau lapuk.",
          "Menarik balik persetujuan apabila pemprosesan bergantung pada persetujuan.",
          "Membantah pemasaran langsung atau pemprosesan yang mungkin menyebabkan kerosakan atau tekanan.",
          "Meminta pemadaman atau sekatan apabila data tidak lagi diperlukan, tertakluk pada pengecualian undang-undang dan operasi.",
          "Mengubah pilihan analitik anda pada bila-bila masa di halaman Cookies & Analytics.",
        ],
      },
    },
    {
      en: {
        heading: "9. How to request access, correction or deletion",
        paragraphs: [
          `Send a written message headed “Privacy Request” through WhatsApp to ${siteConfig.mobileDisplay} or deliver it to the studio address. Include your name, the phone number used with us, the type of request and any booking, membership, promotion or application reference that helps us locate the record. Do not send an identity document unless we request it for proportionate verification. We will respond within the period required by applicable law. We may retain limited data where required for transactions, legal obligations, fraud prevention or claims.`,
        ],
      },
      ms: {
        heading: "9. Cara meminta akses, pembetulan atau pemadaman",
        paragraphs: [
          `Hantar mesej bertulis bertajuk “Permintaan Privasi” melalui WhatsApp ke ${siteConfig.mobileDisplay} atau serahkan ke alamat studio. Sertakan nama, nombor telefon yang digunakan dengan kami, jenis permintaan dan sebarang rujukan tempahan, keahlian, promosi atau permohonan yang membantu kami mencari rekod. Jangan hantar dokumen pengenalan melainkan kami memintanya untuk pengesahan yang seimbang. Kami akan menjawab dalam tempoh yang dikehendaki undang-undang. Kami mungkin menyimpan data terhad jika diperlukan bagi transaksi, kewajipan undang-undang, pencegahan penipuan atau tuntutan.`,
        ],
      },
    },
    {
      en: {
        heading: "10. Updates",
        paragraphs: [
          "We may update this notice when our practices or legal obligations change. The current version and effective date will be published here. Material changes affecting existing choices will be highlighted where reasonably practicable.",
        ],
      },
      ms: {
        heading: "10. Kemas kini",
        paragraphs: [
          "Kami boleh mengemas kini notis ini apabila amalan atau kewajipan undang-undang berubah. Versi semasa dan tarikh berkuat kuasa akan diterbitkan di sini. Perubahan penting yang menjejaskan pilihan sedia ada akan diketengahkan jika munasabah.",
        ],
      },
    },
  ],
};

const termsDocument: LegalDocument = {
  eyebrow: "WEBSITE TERMS",
  title: "Terms of Use",
  titleMs: "Terma Penggunaan",
  updated: "27 July 2026",
  introEn:
    "These terms govern use of the Mezzanail Nail Studio website. By continuing to use the site, you agree to these terms. Separate terms may apply to appointments, membership, promotions and third-party services.",
  introMs:
    "Terma ini mengawal penggunaan laman web Mezzanail Nail Studio. Dengan terus menggunakan laman ini, anda bersetuju dengan terma ini. Terma berasingan mungkin terpakai kepada janji temu, keahlian, promosi dan perkhidmatan pihak ketiga.",
  sections: [
    {
      en: {
        heading: "1. Website information",
        paragraphs: [
          "We aim to keep information accurate and current, but service descriptions, prices, availability, benefits and campaign details may change. A booking is not confirmed until the studio or the relevant booking provider confirms it.",
        ],
      },
      ms: {
        heading: "1. Maklumat laman web",
        paragraphs: [
          "Kami berusaha memastikan maklumat tepat dan terkini, tetapi penerangan perkhidmatan, harga, ketersediaan, manfaat dan butiran kempen boleh berubah. Tempahan belum disahkan sehingga studio atau penyedia tempahan berkaitan mengesahkannya.",
        ],
      },
    },
    {
      en: {
        heading: "2. Acceptable use",
        bullets: [
          "Do not misuse, disrupt, probe, scrape at scale or attempt unauthorised access to the site or its systems.",
          "Do not submit false, unlawful, harmful or infringing content.",
          "Do not impersonate another person or interfere with another person’s booking, membership, promotion entry or application.",
        ],
      },
      ms: {
        heading: "2. Penggunaan yang dibenarkan",
        bullets: [
          "Jangan menyalahgunakan, mengganggu, menguji, mengikis secara besar-besaran atau cuba mendapat akses tanpa kebenaran kepada laman atau sistemnya.",
          "Jangan hantar kandungan palsu, menyalahi undang-undang, berbahaya atau melanggar hak.",
          "Jangan menyamar sebagai orang lain atau mengganggu tempahan, keahlian, penyertaan promosi atau permohonan orang lain.",
        ],
      },
    },
    {
      en: {
        heading: "3. Bookings, services and external platforms",
        paragraphs: [
          "Booking, app, map, social media and messaging links may take you to third-party platforms. Their availability, security and terms are controlled by those providers. Salon services remain subject to consultation, suitability, studio policies and confirmation at the time of service.",
        ],
      },
      ms: {
        heading: "3. Tempahan, perkhidmatan dan platform luar",
        paragraphs: [
          "Pautan tempahan, aplikasi, peta, media sosial dan pemesejan mungkin membawa anda ke platform pihak ketiga. Ketersediaan, keselamatan dan terma mereka dikawal oleh penyedia tersebut. Perkhidmatan salon tertakluk pada konsultasi, kesesuaian, polisi studio dan pengesahan semasa perkhidmatan.",
        ],
      },
    },
    {
      en: {
        heading: "4. Health information",
        paragraphs: [
          "Website content is general information and is not medical advice, diagnosis or treatment. Tell the technician about relevant allergies, sensitivities, injuries or conditions before a service and seek qualified medical advice where appropriate.",
        ],
      },
      ms: {
        heading: "4. Maklumat kesihatan",
        paragraphs: [
          "Kandungan laman web ialah maklumat umum dan bukan nasihat, diagnosis atau rawatan perubatan. Maklumkan juruteknik tentang alahan, sensitiviti, kecederaan atau keadaan berkaitan sebelum perkhidmatan dan dapatkan nasihat perubatan bertauliah jika sesuai.",
        ],
      },
    },
    {
      en: {
        heading: "5. Intellectual property",
        paragraphs: [
          "The site, brand assets, copy, layout, photographs and other original material are owned by or licensed to Mezzanail. You may view and share public page links for personal, non-commercial use, but may not reproduce or commercially exploit material without written permission.",
        ],
      },
      ms: {
        heading: "5. Harta intelek",
        paragraphs: [
          "Laman, aset jenama, teks, susun atur, foto dan bahan asal lain dimiliki atau dilesenkan kepada Mezzanail. Anda boleh melihat dan berkongsi pautan halaman awam untuk kegunaan peribadi bukan komersial, tetapi tidak boleh menghasilkan semula atau mengeksploitasi bahan secara komersial tanpa kebenaran bertulis.",
        ],
      },
    },
    {
      en: {
        heading: "6. Availability and liability",
        paragraphs: [
          "We may change, suspend or withdraw site features for maintenance, security or business reasons. To the maximum extent permitted by law, we are not responsible for indirect or consequential loss arising solely from website unavailability, third-party services or reliance on general website information. Nothing in these terms excludes rights or liability that cannot lawfully be excluded.",
        ],
      },
      ms: {
        heading: "6. Ketersediaan dan liabiliti",
        paragraphs: [
          "Kami boleh mengubah, menggantung atau menarik balik ciri laman untuk penyelenggaraan, keselamatan atau sebab perniagaan. Setakat maksimum yang dibenarkan undang-undang, kami tidak bertanggungjawab atas kerugian tidak langsung atau berbangkit yang timbul semata-mata daripada ketidaktersediaan laman, perkhidmatan pihak ketiga atau pergantungan pada maklumat umum laman. Tiada apa-apa dalam terma ini mengecualikan hak atau liabiliti yang tidak boleh dikecualikan secara sah.",
        ],
      },
    },
    {
      en: {
        heading: "7. Privacy",
        paragraphs: [
          "Our Privacy Policy explains how personal data is handled. Additional notices apply to job applicants, membership and analytics choices.",
        ],
      },
      ms: {
        heading: "7. Privasi",
        paragraphs: [
          "Notis Privasi kami menerangkan cara data peribadi dikendalikan. Notis tambahan terpakai kepada pemohon kerja, keahlian dan pilihan analitik.",
        ],
      },
    },
    {
      en: {
        heading: "8. Governing law and changes",
        paragraphs: [
          "These terms are governed by the laws of Malaysia. Disputes are subject to the jurisdiction of the Malaysian courts, without limiting any mandatory consumer right. We may update these terms by publishing the revised version and effective date on this page.",
        ],
      },
      ms: {
        heading: "8. Undang-undang dan perubahan",
        paragraphs: [
          "Terma ini dikawal oleh undang-undang Malaysia. Pertikaian tertakluk pada bidang kuasa mahkamah Malaysia tanpa mengehadkan hak pengguna mandatori. Kami boleh mengemas kini terma ini dengan menerbitkan versi dan tarikh berkuat kuasa yang disemak pada halaman ini.",
        ],
      },
    },
  ],
};

const jobPrivacyDocument: LegalDocument = {
  eyebrow: "RECRUITMENT PRIVACY",
  title: "Job Applicant Privacy Notice",
  titleMs: "Notis Privasi Pemohon Kerja",
  updated: "27 July 2026",
  introEn:
    "This notice applies when you apply for a role with Mezzanail Nail Studio through our website or related recruitment channels. It supplements our general Privacy Policy.",
  introMs:
    "Notis ini terpakai apabila anda memohon jawatan dengan Mezzanail Nail Studio melalui laman web atau saluran pengambilan pekerja berkaitan. Ia melengkapi Notis Privasi umum kami.",
  sections: [
    {
      en: {
        heading: "1. Data we collect",
        bullets: [
          "Name, WhatsApp number, current area, age confirmation, start-date availability, role, work arrangement and transport information.",
          "Employment status, work history, previous workplace, reason for applying, skills and languages.",
          "Portfolio or Instagram link, additional notes and your declarations.",
          "Application reference, submission status, provider delivery reference, security hashes and limited audit information.",
        ],
      },
      ms: {
        heading: "1. Data yang kami kumpul",
        bullets: [
          "Nama, nombor WhatsApp, kawasan semasa, pengesahan umur, tarikh mula, jawatan, aturan kerja dan maklumat pengangkutan.",
          "Status pekerjaan, sejarah kerja, tempat kerja terdahulu, sebab memohon, kemahiran dan bahasa.",
          "Pautan portfolio atau Instagram, nota tambahan dan pengisytiharan anda.",
          "Rujukan permohonan, status penghantaran, rujukan penghantaran penyedia, cincangan keselamatan dan maklumat audit terhad.",
        ],
      },
    },
    {
      en: {
        heading: "2. Purpose and consequences",
        paragraphs: [
          "We use the data to receive and review your application, assess suitability, contact you, arrange interviews, verify information reasonably needed for recruitment, prevent duplicate or abusive submissions and keep an accountable recruitment record. Required fields are necessary to assess and deliver the application; without them we cannot process it.",
        ],
      },
      ms: {
        heading: "2. Tujuan dan akibat",
        paragraphs: [
          "Kami menggunakan data untuk menerima dan menilai permohonan, menilai kesesuaian, menghubungi anda, mengatur temu duga, mengesahkan maklumat yang munasabah diperlukan, mencegah penghantaran berganda atau penyalahgunaan dan menyimpan rekod pengambilan yang boleh dipertanggungjawabkan. Medan wajib diperlukan untuk menilai dan menghantar permohonan; tanpanya kami tidak dapat memproses permohonan.",
        ],
      },
    },
    {
      en: {
        heading: "3. How the application is handled",
        paragraphs: [
          "Your browser keeps an unfinished draft in session storage. On submission, the server validates the form, creates an application reference and an in-memory PDF, sends the PDF to the controlled Mezzanail recruitment inbox, then clears the PDF bytes from server memory. The website does not create a public PDF link or permanent PDF file store.",
        ],
      },
      ms: {
        heading: "3. Cara permohonan dikendalikan",
        paragraphs: [
          "Pelayar anda menyimpan draf belum selesai dalam storan sesi. Semasa penghantaran, pelayan mengesahkan borang, mencipta rujukan permohonan dan PDF dalam memori, menghantar PDF ke peti masuk pengambilan Mezzanail yang dikawal, kemudian mengosongkan bait PDF daripada memori pelayan. Laman web tidak mencipta pautan PDF awam atau stor fail PDF kekal.",
        ],
      },
    },
    {
      en: {
        heading: "4. Recipients and overseas processing",
        paragraphs: [
          "Access is limited to authorised hiring personnel and providers supporting hosting, database, security and email delivery, including Vercel, Neon and Resend. The received email may be held by the studio’s email provider. These providers may process data outside Malaysia under their service safeguards. We do not sell applicant data.",
        ],
      },
      ms: {
        heading: "4. Penerima dan pemprosesan di luar negara",
        paragraphs: [
          "Akses dihadkan kepada kakitangan pengambilan yang diberi kuasa dan penyedia pengehosan, pangkalan data, keselamatan serta penghantaran e-mel, termasuk Vercel, Neon dan Resend. E-mel yang diterima mungkin disimpan oleh penyedia e-mel studio. Penyedia ini mungkin memproses data di luar Malaysia di bawah perlindungan perkhidmatan mereka. Kami tidak menjual data pemohon.",
        ],
      },
    },
    {
      en: {
        heading: "5. Retention",
        paragraphs: [
          "Applications from unsuccessful candidates are normally retained for up to 12 months from submission so we can complete recruitment, respond to queries and consider a candidate for a closely related role. If you are hired, relevant information becomes part of your employment record and is retained under the applicable employee retention schedule. Failed or abandoned submission records are reviewed and removed when no longer needed for retry, security or audit purposes.",
        ],
      },
      ms: {
        heading: "5. Tempoh penyimpanan",
        paragraphs: [
          "Permohonan calon yang tidak berjaya lazimnya disimpan sehingga 12 bulan dari tarikh penghantaran untuk melengkapkan pengambilan, menjawab pertanyaan dan mempertimbangkan calon bagi jawatan berkaitan. Jika anda diambil bekerja, maklumat berkaitan menjadi sebahagian rekod pekerjaan dan disimpan mengikut jadual rekod pekerja. Rekod penghantaran gagal atau ditinggalkan disemak dan dipadam apabila tidak lagi diperlukan untuk percubaan semula, keselamatan atau audit.",
        ],
      },
    },
    {
      en: {
        heading: "6. No automated hiring decision",
        paragraphs: [
          "The website validates completeness and security but does not make an automated decision to hire or reject you. Recruitment decisions are made by authorised people.",
        ],
      },
      ms: {
        heading: "6. Tiada keputusan pengambilan automatik",
        paragraphs: [
          "Laman web mengesahkan kelengkapan dan keselamatan tetapi tidak membuat keputusan automatik untuk mengambil atau menolak anda. Keputusan pengambilan dibuat oleh kakitangan yang diberi kuasa.",
        ],
      },
    },
    {
      en: {
        heading: "7. Your rights and deletion requests",
        paragraphs: [
          `You may request access, correction, withdrawal of consent or deletion by sending a “Job Applicant Privacy Request” through WhatsApp to ${siteConfig.mobileDisplay}. Include your application reference if available. We may ask for proportionate verification and may retain limited information where legally required or needed for claims, security or an active recruitment process.`,
        ],
      },
      ms: {
        heading: "7. Hak dan permintaan pemadaman",
        paragraphs: [
          `Anda boleh meminta akses, pembetulan, penarikan persetujuan atau pemadaman dengan menghantar “Permintaan Privasi Pemohon Kerja” melalui WhatsApp ke ${siteConfig.mobileDisplay}. Sertakan rujukan permohonan jika ada. Kami mungkin meminta pengesahan yang seimbang dan menyimpan maklumat terhad jika dikehendaki undang-undang atau diperlukan bagi tuntutan, keselamatan atau proses pengambilan aktif.`,
        ],
      },
    },
  ],
};

const membershipTermsDocument: LegalDocument = {
  eyebrow: "MEMBERSHIP PROGRAMME",
  title: "Membership Terms",
  titleMs: "Terma Keahlian",
  updated: "27 July 2026",
  introEn:
    "These terms apply to the Mezzanail membership and rewards programme. The website presents programme information and interface previews; the current member record, balance, eligible rewards and expiry details shown by the authorised membership app or confirmed by the studio control.",
  introMs:
    "Terma ini terpakai kepada program keahlian dan ganjaran Mezzanail. Laman web memaparkan maklumat program dan pratonton antara muka; rekod ahli, baki, ganjaran layak dan butiran luput semasa yang ditunjukkan oleh aplikasi keahlian yang dibenarkan atau disahkan oleh studio adalah muktamad.",
  sections: [
    {
      en: {
        heading: "1. Joining and account responsibility",
        paragraphs: [
          "Membership is personal to the registered member. Provide accurate contact information, keep account access secure and tell the studio promptly if details change or access may be compromised. A parent or guardian must approve participation where required by law.",
        ],
      },
      ms: {
        heading: "1. Penyertaan dan tanggungjawab akaun",
        paragraphs: [
          "Keahlian adalah peribadi kepada ahli berdaftar. Berikan maklumat hubungan yang tepat, lindungi akses akaun dan maklumkan studio dengan segera jika butiran berubah atau akses mungkin terjejas. Ibu bapa atau penjaga mesti meluluskan penyertaan jika dikehendaki undang-undang.",
        ],
      },
    },
    {
      en: {
        heading: "2. Earning and balances",
        paragraphs: [
          "Credits, points, visits or rewards are recorded only for eligible transactions and activities under the offer current at that time. Processing may not be immediate. The studio may correct duplicate, reversed, refunded, fraudulent or erroneous entries after reasonable review.",
        ],
      },
      ms: {
        heading: "2. Pengumpulan dan baki",
        paragraphs: [
          "Kredit, mata, lawatan atau ganjaran direkodkan hanya bagi transaksi dan aktiviti layak di bawah tawaran semasa. Pemprosesan mungkin tidak serta-merta. Studio boleh membetulkan catatan berganda, dibatalkan, dipulangkan, menipu atau tersilap selepas semakan munasabah.",
        ],
      },
    },
    {
      en: {
        heading: "3. Rewards and redemption",
        paragraphs: [
          "Rewards are subject to availability, stated eligibility, validity dates, service exclusions and appointment confirmation. They have no cash value, are not refundable and are not transferable or combinable unless the specific offer says otherwise. Present the required member identification when redeeming.",
        ],
      },
      ms: {
        heading: "3. Ganjaran dan penebusan",
        paragraphs: [
          "Ganjaran tertakluk pada ketersediaan, kelayakan dinyatakan, tarikh sah, pengecualian perkhidmatan dan pengesahan janji temu. Ganjaran tiada nilai tunai, tidak boleh dibayar balik dan tidak boleh dipindah atau digabungkan kecuali tawaran tertentu menyatakan sebaliknya. Tunjukkan pengenalan ahli yang diperlukan semasa menebus.",
        ],
      },
    },
    {
      en: {
        heading: "4. Expiry and inactivity",
        paragraphs: [
          "Any expiry date or inactivity rule applicable to a credit or reward will be displayed in the authorised member app, offer or campaign terms. A preview or general marketing statement does not override the specific validity shown on the member record.",
        ],
      },
      ms: {
        heading: "4. Luput dan ketidakaktifan",
        paragraphs: [
          "Tarikh luput atau peraturan ketidakaktifan bagi sesuatu kredit atau ganjaran akan dipaparkan dalam aplikasi ahli, tawaran atau terma kempen yang dibenarkan. Pratonton atau kenyataan pemasaran umum tidak mengatasi tempoh sah khusus pada rekod ahli.",
        ],
      },
    },
    {
      en: {
        heading: "5. Birthday, referral and promotional benefits",
        paragraphs: [
          "These benefits apply only when the member meets the published eligibility and verification conditions. Referral rewards require a qualifying new membership or transaction where stated. Separate promotion terms prevail for campaign rewards.",
        ],
      },
      ms: {
        heading: "5. Manfaat hari jadi, rujukan dan promosi",
        paragraphs: [
          "Manfaat ini hanya terpakai apabila ahli memenuhi syarat kelayakan dan pengesahan yang diterbitkan. Ganjaran rujukan memerlukan keahlian baharu atau transaksi yang layak jika dinyatakan. Terma promosi berasingan mengatasi bagi ganjaran kempen.",
        ],
      },
    },
    {
      en: {
        heading: "6. Misuse, suspension and termination",
        paragraphs: [
          "We may suspend or close an account and cancel improperly obtained benefits where there is fraud, abuse, unauthorised access, resale, manipulation or a material breach of these terms. We will review a reasonable explanation before a final adverse action where practicable.",
        ],
      },
      ms: {
        heading: "6. Penyalahgunaan, penggantungan dan penamatan",
        paragraphs: [
          "Kami boleh menggantung atau menutup akaun dan membatalkan manfaat yang diperoleh secara tidak wajar jika berlaku penipuan, penyalahgunaan, akses tanpa kebenaran, jualan semula, manipulasi atau pelanggaran penting terma. Kami akan menilai penjelasan munasabah sebelum tindakan muktamad jika praktikal.",
        ],
      },
    },
    {
      en: {
        heading: "7. Programme changes",
        paragraphs: [
          "We may change benefits, partners, earning rules or the programme where reasonably necessary. Material changes will be communicated through the website, app or registered contact channel where practicable. Existing legal and consumer rights are not excluded.",
        ],
      },
      ms: {
        heading: "7. Perubahan program",
        paragraphs: [
          "Kami boleh mengubah manfaat, rakan kongsi, peraturan pengumpulan atau program jika munasabah diperlukan. Perubahan penting akan dimaklumkan melalui laman web, aplikasi atau saluran hubungan berdaftar jika praktikal. Hak undang-undang dan pengguna sedia ada tidak dikecualikan.",
        ],
      },
    },
    {
      en: {
        heading: "8. Privacy and help",
        paragraphs: [
          `Membership data is handled under our Privacy Policy. For balance corrections, programme questions, account closure or privacy requests, contact the studio through WhatsApp at ${siteConfig.mobileDisplay}.`,
        ],
      },
      ms: {
        heading: "8. Privasi dan bantuan",
        paragraphs: [
          `Data keahlian dikendalikan di bawah Notis Privasi kami. Untuk pembetulan baki, pertanyaan program, penutupan akaun atau permintaan privasi, hubungi studio melalui WhatsApp di ${siteConfig.mobileDisplay}.`,
        ],
      },
    },
  ],
};

const cookiesDocument: LegalDocument = {
  eyebrow: "COOKIE & ANALYTICS NOTICE",
  title: "Cookies & Analytics",
  titleMs: "Cookies & Analitik",
  updated: "27 July 2026",
  introEn:
    "This page explains the browser storage and analytics used on the Mezzanail website. Non-essential Google Analytics is not loaded unless you choose “Accept analytics”. You may reject it and continue using the public website.",
  introMs:
    "Halaman ini menerangkan storan pelayar dan analitik yang digunakan pada laman Mezzanail. Google Analytics yang tidak penting tidak dimuatkan melainkan anda memilih “Terima analitik”. Anda boleh menolaknya dan terus menggunakan laman awam.",
  sections: [
    {
      en: {
        heading: "1. Necessary browser storage",
        bullets: [
          "Language and theme preferences may be stored locally so the site can remember your display choice.",
          "The job form uses session storage for an unfinished draft, retry token and application result. Session storage is limited to the browser tab/session and is not an analytics cookie.",
          "The analytics choice is stored locally for up to 12 months so the site can respect your decision.",
        ],
      },
      ms: {
        heading: "1. Storan pelayar yang perlu",
        bullets: [
          "Pilihan bahasa dan tema mungkin disimpan secara setempat supaya laman mengingati pilihan paparan.",
          "Borang kerja menggunakan storan sesi untuk draf belum selesai, token percubaan semula dan hasil permohonan. Storan sesi terhad kepada tab/sesi pelayar dan bukan cookie analitik.",
          "Pilihan analitik disimpan secara setempat sehingga 12 bulan supaya laman menghormati keputusan anda.",
        ],
      },
    },
    {
      en: {
        heading: "2. Google Analytics",
        paragraphs: [
          "If accepted, Google Analytics 4 measures page views and limited interaction context such as the clicked content label and destination. We do not intentionally send names, phone numbers, application fields, payment data or free-text messages to Analytics. Advertising signals and ad-personalisation signals are disabled in the site configuration.",
        ],
      },
      ms: {
        heading: "2. Google Analytics",
        paragraphs: [
          "Jika diterima, Google Analytics 4 mengukur paparan halaman dan konteks interaksi terhad seperti label kandungan serta destinasi yang diklik. Kami tidak sengaja menghantar nama, nombor telefon, medan permohonan, data pembayaran atau mesej teks bebas kepada Analytics. Isyarat pengiklanan dan pemperibadian iklan dilumpuhkan dalam konfigurasi laman.",
        ],
      },
    },
    {
      en: {
        heading: "3. Analytics cookies and duration",
        bullets: [
          "_ga: distinguishes browsers for measurement; configured by this site for up to 12 months.",
          "_ga_<measurement-id>: maintains session state; configured by this site for up to 12 months.",
          "Google Analytics user and event data is retained for up to 14 months; standard aggregated reporting may remain longer.",
        ],
      },
      ms: {
        heading: "3. Cookie analitik dan tempoh",
        bullets: [
          "_ga: membezakan pelayar bagi pengukuran; dikonfigurasi oleh laman ini sehingga 12 bulan.",
          "_ga_<measurement-id>: mengekalkan keadaan sesi; dikonfigurasi oleh laman ini sehingga 12 bulan.",
          "Data pengguna dan peristiwa Google Analytics disimpan sehingga 14 bulan; laporan agregat standard mungkin kekal lebih lama.",
        ],
      },
    },
    {
      en: {
        heading: "4. External websites",
        paragraphs: [
          "Booking, maps, WhatsApp, social media, app-store and other external links may set their own cookies after you leave this website or interact with embedded content. Their notices and controls apply independently.",
        ],
      },
      ms: {
        heading: "4. Laman luar",
        paragraphs: [
          "Pautan tempahan, peta, WhatsApp, media sosial, gedung aplikasi dan pautan luar lain mungkin menetapkan cookie mereka sendiri selepas anda meninggalkan laman ini atau berinteraksi dengan kandungan terbenam. Notis dan kawalan mereka terpakai secara berasingan.",
        ],
      },
    },
    {
      en: {
        heading: "5. Change or withdraw your choice",
        paragraphs: [
          "Use the button below to reopen analytics settings. Rejecting analytics prevents future Analytics loading on this browser and removes accessible Mezzanail Analytics cookies. You may also clear cookies and site storage in your browser. A browser or privacy extension may block additional storage.",
        ],
      },
      ms: {
        heading: "5. Ubah atau tarik balik pilihan",
        paragraphs: [
          "Gunakan butang di bawah untuk membuka semula tetapan analitik. Menolak analitik menghalang pemuatan Analytics pada masa hadapan dalam pelayar ini dan memadam cookie Analytics Mezzanail yang boleh diakses. Anda juga boleh mengosongkan cookie dan storan laman dalam pelayar. Pelayar atau sambungan privasi mungkin menyekat storan tambahan.",
        ],
      },
    },
  ],
};

const documents: Record<LegalDocumentKind, LegalDocument> = {
  privacy: privacyDocument,
  terms: termsDocument,
  "job-privacy": jobPrivacyDocument,
  "membership-terms": membershipTermsDocument,
  cookies: cookiesDocument,
};

const relatedLinks = [
  ["/privacy", "Privacy / Privasi"],
  ["/terms", "Terms of Use / Terma Penggunaan"],
  ["/privacy/job-applicants", "Job Applicant Privacy"],
  ["/membership/terms", "Membership Terms"],
  ["/promotion/terms", "Promotion Terms"],
  ["/cookies", "Cookies & Analytics"],
] as const;

function LanguageCopy({ copy, label }: { copy: LanguageSection; label: string }) {
  return (
    <div>
      <span className="legal-language-label">{label}</span>
      <h2>{copy.heading}</h2>
      {copy.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {copy.bullets ? (
        <ul>
          {copy.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
        </ul>
      ) : null}
    </div>
  );
}

export function LegalDocumentPage({ kind }: { kind: LegalDocumentKind }) {
  const document = documents[kind];
  const privacyRequestUrl = `${siteConfig.whatsappUrl}${
    siteConfig.whatsappUrl.includes("?") ? "&" : "?"
  }text=${encodeURIComponent(
    "Hello Mezzanail Nail Studio, I would like to make a Privacy Request. My request concerns:",
  )}`;

  return (
    <OfficialFrame>
      <article className="legal-document">
        <header className="page-hero">
          <div className="shell">
            <div className="eyebrow">{document.eyebrow}</div>
            <h1 className="display mt-6">{document.title}</h1>
            <p className="legal-ms-title">{document.titleMs}</p>
            <p className="mt-7 text-sm text-[var(--muted)]">Effective / Berkuat kuasa: {document.updated}</p>
          </div>
        </header>

        <div className="section surface">
          <div className="shell legal-shell">
            <nav className="legal-related-links" aria-label="Legal documents">
              {relatedLinks.map(([href, label]) => (
                <Link key={href} href={href}>{label}</Link>
              ))}
            </nav>

            <section className="legal-intro">
              <div>
                <span className="legal-language-label">ENGLISH</span>
                <p>{document.introEn}</p>
              </div>
              <div lang="ms">
                <span className="legal-language-label">BAHASA MALAYSIA</span>
                <p>{document.introMs}</p>
              </div>
            </section>

            {document.sections.map((section) => (
              <section className="legal-section" key={section.en.heading}>
                <LanguageCopy copy={section.en} label="EN" />
                <div lang="ms">
                  <LanguageCopy copy={section.ms} label="BM" />
                </div>
              </section>
            ))}

            {kind === "cookies" ? (
              <div className="legal-action-panel">
                <div>
                  <h2>Analytics settings / Tetapan analitik</h2>
                  <p>Accept, reject or change the analytics choice for this browser.</p>
                </div>
                <AnalyticsSettingsButton />
              </div>
            ) : null}

            {(kind === "privacy" || kind === "job-privacy") ? (
              <div className="legal-action-panel">
                <div>
                  <h2>Make a privacy request / Buat permintaan privasi</h2>
                  <p>Contact the studio in writing through WhatsApp and keep a copy of your request.</p>
                </div>
                <a className="btn btn-dark" href={privacyRequestUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={16} />
                  WhatsApp Privacy Request
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </OfficialFrame>
  );
}
