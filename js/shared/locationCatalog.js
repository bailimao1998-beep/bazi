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
