const fallbackCatalog = {
  standardMeridian: 120,
  timezone: "Asia/Shanghai",
  cities: [],
};

export async function loadLocationCatalog() {
  return getRuntimeLocationCatalog();
}

export function getRuntimeLocationCatalog() {
  return normalizeCatalog(window.FortuneLocationData || fallbackCatalog);
}

export function normalizeCatalog(input = {}) {
  const cities = Array.isArray(input.cities) ? input.cities : [];

  return {
    standardMeridian: Number(input.standardMeridian || 120),
    timezone: input.timezone || "Asia/Shanghai",
    cities: cities
      .map((item) => {
        const province = String(item.province || "").trim();
        const city = String(item.city || item.name || "").trim();
        const area = String(item.area || "").trim();
        const name = String(item.name || item.displayName || item.city || "").trim();
        const displayName = String(item.displayName || item.fullName || item.name || "").trim();

        return {
          province,
          city,
          area,
          name,
          displayName,
          fullName: buildFullName(item, province, city, area, displayName),
          aliases: Array.isArray(item.aliases) ? item.aliases : [],
          longitude: Number(item.longitude),
          latitude: Number(item.latitude),
          timezone: item.timezone || input.timezone || "Asia/Shanghai",
          standardMeridian: Number(item.standardMeridian || input.standardMeridian || 120),
        };
      })
      .filter((item) => item.province && item.city && Number.isFinite(item.longitude)),
  };
}

function buildFullName(item, province, city, area, displayName) {
  if (item.fullName) return String(item.fullName).trim();
  if (area) return `${province}${city}${area}`;
  if (city && city !== "市辖区" && city !== province) return `${province}${city}`;
  return displayName || province || city;
}

export function getProvinceOptions(catalog = {}) {
  return [...new Set((catalog.cities || []).map((item) => item.province))];
}

export function getCitiesByProvince(catalog = {}, province) {
  return (catalog.cities || []).filter((item) => item.province === province);
}

export function findLocation(catalog = {}, { birthProvince, birthplace } = {}) {
  const province = String(birthProvince || "").trim();
  const query = normalizeText(birthplace);

  if (!query) return null;

  const list = province
    ? (catalog.cities || []).filter((item) => item.province === province)
    : catalog.cities || [];

  return findBestLocationMatch(list, query);
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, "")
    .replace(/[·\-_/]/g, "")
    .trim();
}

function findBestLocationMatch(list = [], query) {
  const candidates = list
    .map((item) => ({ item, score: scoreLocationMatch(item, query) }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score);

  return candidates[0]?.item || null;
}

function scoreLocationMatch(item = {}, query) {
  const names = [
    item.name,
    item.displayName,
    item.fullName,
    item.city,
    item.area,
    ...(item.aliases || []),
  ]
    .filter(Boolean)
    .map(normalizeText);

  if (names.some((name) => query === name)) return 100;
  if (names.some((name) => name.endsWith("市") && query === name.slice(0, -1))) return 90;
  if (names.some((name) => name.includes(query))) return 50;
  if (names.some((name) => query.includes(name))) return 10;
  return 0;
}
