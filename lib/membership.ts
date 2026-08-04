export type MembershipFactId =
  | "membership-balance"
  | "bonus-credit"
  | "reward-credit"
  | "product-voucher"
  | "birthday-benefit"
  | "member-pricing";

type MembershipFact = {
  id: MembershipFactId;
  label: string;
  description: string;
};

export const membershipFacts = {
  en: [
    {
      id: "membership-balance",
      label: "Membership balance",
      description:
        "Your current paid or stored membership balance, where applicable, is shown in the authorised member app.",
    },
    {
      id: "bonus-credit",
      label: "Bonus Credit",
      description:
        "Any promotional bonus, eligible use and validity are shown with the specific offer or member record.",
    },
    {
      id: "reward-credit",
      label: "Reward Credit",
      description:
        "Any earned reward balance and redemption conditions are confirmed in the authorised member app.",
    },
    {
      id: "product-voucher",
      label: "Product Voucher",
      description:
        "Product voucher value, eligible products and expiry are governed by the voucher shown in your account.",
    },
    {
      id: "birthday-benefit",
      label: "Birthday Benefit",
      description:
        "Availability, eligibility, booking window and validity are shown in the member app or confirmed by the Melaka studio.",
    },
    {
      id: "member-pricing",
      label: "Member Pricing",
      description:
        "Current member prices and whether offers may be combined are stated with the applicable offer.",
    },
  ],
  zh: [
    {
      id: "membership-balance",
      label: "会员余额",
      description:
        "如适用，当前付费或储值会员余额显示于授权会员 App。",
    },
    {
      id: "bonus-credit",
      label: "Bonus Credit",
      description:
        "促销赠送额度、适用范围与有效期以相关优惠或会员记录为准。",
    },
    {
      id: "reward-credit",
      label: "Reward Credit",
      description:
        "已获得的奖励额度及兑换条件以授权会员 App 为准。",
    },
    {
      id: "product-voucher",
      label: "Product Voucher",
      description:
        "产品礼券金额、适用产品与有效期以账户中的礼券为准。",
    },
    {
      id: "birthday-benefit",
      label: "生日礼遇",
      description:
        "是否提供、适用资格、预约期限与有效期以会员 App 或 Melaka 门店确认为准。",
    },
    {
      id: "member-pricing",
      label: "会员专价",
      description:
        "当前会员价格及优惠是否可叠加，以相关优惠条款为准。",
    },
  ],
  ms: [
    {
      id: "membership-balance",
      label: "Baki keahlian",
      description:
        "Baki keahlian berbayar atau tersimpan, jika berkenaan, dipaparkan dalam aplikasi ahli.",
    },
    {
      id: "bonus-credit",
      label: "Bonus Credit",
      description:
        "Bonus promosi, kegunaan layak dan tempoh sah ditunjukkan bersama tawaran atau rekod ahli.",
    },
    {
      id: "reward-credit",
      label: "Reward Credit",
      description:
        "Baki ganjaran dan syarat penebusan disahkan dalam aplikasi ahli.",
    },
    {
      id: "product-voucher",
      label: "Product Voucher",
      description:
        "Nilai baucar produk, produk layak dan tarikh luput mengikut baucar dalam akaun.",
    },
    {
      id: "birthday-benefit",
      label: "Manfaat hari jadi",
      description:
        "Ketersediaan, kelayakan, tempoh tempahan dan tempoh sah disahkan dalam aplikasi atau oleh studio Melaka.",
    },
    {
      id: "member-pricing",
      label: "Harga ahli",
      description:
        "Harga ahli semasa dan sama ada tawaran boleh digabungkan tertakluk pada tawaran berkenaan.",
    },
  ],
} as const satisfies Record<"en" | "zh" | "ms", readonly MembershipFact[]>;

export function membershipFactItems(locale: keyof typeof membershipFacts) {
  return membershipFacts[locale].map(
    ({ label, description }) => [label, description] as const,
  );
}

export function membershipTermsBullets(locale: "en" | "ms") {
  return membershipFacts[locale].map(
    ({ label, description }) => `${label}: ${description}`,
  );
}
