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

  return list.find((item) => {
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

    return names.some((name) => {
      return query === name || query.includes(name) || name.includes(query);
    });
  }) || null;
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, "")
    .replace(/[·\-_/]/g, "")
    .trim();
}