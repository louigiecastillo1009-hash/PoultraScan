// PSGC Cloud API v2 client — Philippine administrative locations.
// Public API, no key required. Docs: https://psgc.cloud/api-docs/v2
//
// Responses look like: {"data": [{code, name, type, ...}, ...]}
// Results are cached in-memory per (resource, parent) so re-opening a
// dropdown never re-downloads the same list. Duplicate concurrent requests
// for the same resource are collapsed into one fetch.

const PSGC_BASE = 'https://psgc.cloud/api/v2';

// Successful responses are cached forever in this Map (the PSGC hierarchy
// is static); format: `${path}` -> normalized option array.
const cache = new Map();

// In-flight request Map so two simultaneous calls share one fetch.
const inFlight = new Map();

const VALID_TYPES = new Set(['City', 'Mun']);

/**
 * The PSGC data contains mojibake artifacts from double-encoded UTF-8
 * (e.g. "Las PiÃ±as" for "Las Piñas"). If a name carries those byte
 * sequences, repair them; otherwise return the string untouched.
 */
function repairEncoding(name) {
  const hasMojibake =
    name.includes('Ã') || name.includes('â') || name.includes('Å');
  if (!name || !hasMojibake) {
    return name;
  }
  try {
    const bytes = Uint8Array.from([...name], (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    return name;
  }
}

function unwrap(json) {
  // Defensive: accept envelope or bare array; never trust a bare object.
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json)) return json;
  throw new Error('Malformed PSGC response (expected a data array).');
}

/**
 * Fetches a PSGC list endpoint and normalizes it into:
 * [{ code, name, type? }] sorted alphabetically (case-insensitive).
 * Sorting uses localeCompare on a fresh sorted copy — cached arrays are
 * never mutated in place.
 */
async function fetchPsgc(path, { filterTypes = null } = {}) {
  const cacheKey = filterTypes ? `${path}#${[...filterTypes].join(',')}` : path;

  if (cache.has(cacheKey)) return cache.get(cacheKey);
  if (inFlight.has(cacheKey)) return inFlight.get(cacheKey);

  const request = (async () => {
    try {
      let res;
      try {
        res = await fetch(`${PSGC_BASE}${path}`);
      } catch (err) {
        throw new Error('Network error while loading Philippine locations.', { cause: err });
      }
      if (!res.ok) {
        throw new Error(
          res.status === 429
            ? 'Location service rate limit reached. Please try again shortly.'
            : `Location service error (${res.status}).`
        );
      }

      const raw = unwrap(await res.json());

      const normalized = raw
        .map((item) => ({
          code: item?.code ? String(item.code) : null,
          name: repairEncoding(String(item?.name ?? '')).replace(/\s+/g, ' ').trim(),
          type: item?.type ? String(item.type) : null,
        }))
        .filter((o) => o.code && o.name)
        .filter((o) => !filterTypes || (o.type && filterTypes.includes(o.type)))
        .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base', numeric: true }));

      cache.set(cacheKey, normalized);
      return normalized;
    } finally {
      inFlight.delete(cacheKey);
    }
  })();

  inFlight.set(cacheKey, request);
  return request;
}

/** All Philippine regions, alphabetically. */
export function fetchRegions() {
  return fetchPsgc('/regions');
}

/** Provinces of a region (may legitimately be empty, e.g. NCR). */
export function fetchProvinces(regionCode) {
  if (!regionCode) return Promise.resolve([]);
  return fetchPsgc(`/regions/${encodeURIComponent(regionCode)}/provinces`);
}

/**
 * Cities/municipalities listed directly under a region. Includes SubMun
 * records (e.g. Manila's districts in the NCR data), which are NOT valid
 * city/municipality choices, so they are filtered out.
 */
export function fetchRegionCitiesMunicipalities(regionCode) {
  if (!regionCode) return Promise.resolve([]);
  return fetchPsgc(
    `/regions/${encodeURIComponent(regionCode)}/cities-municipalities`,
    { filterTypes: [...VALID_TYPES] }
  );
}

/** Cities/municipalities of one province. */
export function fetchProvinceCitiesMunicipalities(provinceCode) {
  if (!provinceCode) return Promise.resolve([]);
  return fetchPsgc(
    `/provinces/${encodeURIComponent(provinceCode)}/cities-municipalities`,
    { filterTypes: [...VALID_TYPES] }
  );
}

/** Barangays of one city/municipality. */
export function fetchBarangays(cityMunicipalityCode) {
  if (!cityMunicipalityCode) return Promise.resolve([]);
  return fetchPsgc(
    `/cities-municipalities/${encodeURIComponent(cityMunicipalityCode)}/barangays`
  );
}
