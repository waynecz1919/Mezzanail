import { serviceCategories, type ServiceCategoryId } from "./services";

export type HomepageStartingPrices = Partial<Record<ServiceCategoryId, number>>;

function parsePriceAmounts(value: string): number[] | null {
  const matches = [...value.matchAll(/\bRM\s*(\d+(?:\.\d{1,2})?)\b/gi)];
  const unsupportedText = value
    .replace(/\bRM\s*\d+(?:\.\d{1,2})?\b/gi, "")
    .replace(/\bfrom\b/gi, "")
    .replace(/[\s/,+–-]/g, "");

  if (!matches.length || unsupportedText) return null;

  const amounts = matches.map((match) => Number(match[1]));
  return amounts.every(Number.isFinite) ? amounts : null;
}

export function getHomepageStartingPrices(
  categoryIds: readonly ServiceCategoryId[],
): HomepageStartingPrices {
  const prices: HomepageStartingPrices = {};

  for (const categoryId of new Set(categoryIds)) {
    const matches = serviceCategories.filter((category) => category.id === categoryId);
    if (matches.length !== 1) continue;

    const priceableServices = matches[0].services.filter(
      ({ name }) => name.trim().toLowerCase() !== "nail extension removal",
    );
    const priceLists = priceableServices.map(({ price }) => parsePriceAmounts(price));
    if (!priceLists.length || priceLists.some((amounts) => !amounts?.length)) continue;

    const minimum = Math.min(...priceLists.flatMap((amounts) => amounts ?? []));
    if (Number.isFinite(minimum)) prices[categoryId] = minimum;
  }

  return prices;
}
