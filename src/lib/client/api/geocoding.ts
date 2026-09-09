/**
 * Client-side geocoding through Nominatim (nominatim.openstreetmap.org).
 *
 * Usage policy (https://operations.osmfoundation.org/policies/nominatim/):
 * - hard cap of 1 request/second per application → enforced here with a
 *   minimum gap between requests;
 * - autocomplete firing frequently is NOT allowed → callers must
 *   debounce and enforce a minimum query length (the weather page uses a
 *   450 ms debounce + 3-character minimum);
 * - repeated identical queries must be cached → in-memory cache below;
 * - requests must identify the application → the browser sends the site
 *   origin as the HTTP Referer, which is the valid identifier for web apps.
 */
import { reverse, search } from 'nominatim-ts';
import type { JSONV2Place } from 'nominatim-ts';

export interface PlaceSuggestion {
	name: string;
	label: string;
	displayName: string;
	lat: number;
	lon: number;
}

export interface SearchPlacesOptions {
	/** RFC 2616 language list, e.g. "pt-BR,pt". Biases result names. */
	acceptLanguage?: string;
	/** Aborts waiting for the rate-limit gap (not the in-flight request itself). */
	signal?: AbortSignal;
}

const MIN_QUERY_LENGTH = 3;
const REQUEST_GAP_MS = 1100;
const MAX_RESULTS = 7;
const MAX_CACHE_ENTRIES = 60;


type NominatimCity = JSONV2Place<{ addressdetails: 1 }>;

const cache = new Map<string, PlaceSuggestion[]>();
let lastRequestAt = 0;

export async function searchPlaces(
	query: string,
	options: SearchPlacesOptions = {}
): Promise<PlaceSuggestion[]> {
	const trimmed = query.trim();
	if (trimmed.length < MIN_QUERY_LENGTH) return [];

	const cacheKey = trimmed.toLowerCase();
	const cached = cache.get(cacheKey);
	if (cached) return cached;

	// Enforce the 1 request/second policy even if the caller forgot to debounce.
	while (Date.now() - lastRequestAt < REQUEST_GAP_MS) {
		if (options.signal?.aborted) throw new Error('aborted');
		await sleep(100);
	}
	lastRequestAt = Date.now();

	const results = (await search({
		q: trimmed,
		limit: MAX_RESULTS,
		addressdetails: 1,
		format: 'jsonv2',
		...(options.acceptLanguage ? { 'accept-langage': options.acceptLanguage } : {})
	})) as unknown as NominatimCity[];

	// Remove duplicates (same display name)
	const seen = new Set<string>();
	const places: PlaceSuggestion[] = [];
	for (const result of results) {
		const place = toSuggestion(result);
		if (!place || seen.has(place.displayName)) continue;
		seen.add(place.displayName);
		places.push(place);
	}

	if (places.length > 0) {
		cache.set(cacheKey, places);
		if (cache.size > MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value as string);
	}
	return places;
}


export async function searchPlace(
	latitude: number,
	longitude: number,
	options: SearchPlacesOptions = {}
): Promise<PlaceSuggestion | null> {
	if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

	while (Date.now() - lastRequestAt < REQUEST_GAP_MS) {
		if (options.signal?.aborted) throw new Error('aborted');
		await sleep(100);
	}
	lastRequestAt = Date.now();

	const raw = (await reverse({
		lat: latitude,
		lon: longitude,
		addressdetails: 1,
		format: 'jsonv2',
		...(options.acceptLanguage ? { 'accept-langage': options.acceptLanguage } : {})
	})) as unknown as NominatimCity;

	const place = toSuggestion(raw);
	if (!place) return null;

	// O reverse pode cair em rua/POI: sobe pro município no nome exibido.
	const address = raw.address;
	const locality =
		address?.city ?? address?.town ?? address?.village ?? address?.municipality ?? address?.county;
	const region = [address?.state, address?.country].filter((part): part is string => Boolean(part));

	if (locality) place.name = locality;
	place.label = [...new Set(region)].join(', ');
	place.displayName = [place.name, ...region].join(', ');
	return place;
}

function toSuggestion(raw: NominatimCity): PlaceSuggestion | null {
	const lat = Number.parseFloat(raw.lat);
	const lon = Number.parseFloat(raw.lon);
	if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

	const address = raw.address;
	const locality =
		address?.city ??
		address?.town ??
		address?.village ??
		address?.hamlet ??
		address?.municipality ??
		address?.county;
	const parts = [locality, address?.state, address?.country].filter((part): part is string =>
		Boolean(part)
	);
	const label = [...new Set(parts)].join(', ');

	const fallbackName = raw.display_name.split(',')[0]?.trim();
	return {
		name: raw.name || locality || fallbackName || raw.display_name,
		label: label || raw.display_name,
		displayName: raw.display_name,
		lat,
		lon
	};
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
