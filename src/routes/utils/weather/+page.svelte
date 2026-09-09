<script lang="ts">
	import Seo from '$lib/components/heads/seo.svelte';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { ArrowBigRight, MapPin } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import {
		searchPlaces,
		searchPlace as searchPlaceByCoords,
		type PlaceSuggestion
	} from '$lib/client/api/geocoding';
	import { fetchWeather, type WeatherData } from '$lib/client/api/weather';
	import CloudyBackground from './cloudy-background.svelte';
	import WeatherLayout from './weather-layout.svelte';
	import { goto } from '$app/navigation';

	const MIN_QUERY_LENGTH = 3;
	const SUGGESTION_GAP_MS = 1100;

	const locale = getLocale();

	let query = $state('');
	let weather = $state<WeatherData | null>(null);
	let waitingWeatherResponse = $state(false);
	let weatherPlace = $state<PlaceSuggestion | null>(null);

	let suggestions = $state<PlaceSuggestion[]>([]);
	let suggestionsLastUpdate = 0;
	let waitingsuggestionsResponse = $state(false);
	let listOpen = $state(false);

	async function searchPlace(): Promise<void> {
		const trimmed = query.trim();

		if (trimmed.length < MIN_QUERY_LENGTH) {
			suggestions = [];
			listOpen = false;
			if (!trimmed) {
				weather = null;
				weatherPlace = null;
			}
			return;
		}

		if (waitingsuggestionsResponse) return;

		waitingsuggestionsResponse = true;
		try {
			const wait = SUGGESTION_GAP_MS - (Date.now() - suggestionsLastUpdate);
			if (wait > 0) {
				await new Promise((resolve) => setTimeout(resolve, wait));
			}

			if (trimmed !== query.trim()) return;

			suggestionsLastUpdate = Date.now();
			const results = await searchPlaces(trimmed, { acceptLanguage: locale });
			if (trimmed !== query.trim()) return;

			suggestions = results;
			listOpen = results.length > 0;
		} catch {
			suggestions = [];
			listOpen = false;
		} finally {
			waitingsuggestionsResponse = false;

			if (trimmed !== query.trim() && query.trim().length >= MIN_QUERY_LENGTH) {
				void searchPlace();
			}
		}
	}

	async function searchClimateByPlaceSuggestion(index = 0): Promise<void> {
		const place = suggestions[index];
		if (!place || waitingWeatherResponse) return;

		query = place.name;
		listOpen = false;
		weather = null;
		weatherPlace = place;
		waitingWeatherResponse = true;

		try {
			const data = await fetchWeather(place.lat, place.lon);
			if (query.trim() === place.name) {
				weather = data;
				if (page.url.searchParams.get('q') !== place.name) {
					await goto(`?q=${encodeURIComponent(place.name)}`, {
						replaceState: true,
						keepFocus: true,
						noScroll: true
					});
				}
			}
		} catch {
			weather = null;
		} finally {
			waitingWeatherResponse = false;
		}
	}

	onMount(() => {
		const placeQuery = page.url.searchParams.get('q');
		if (placeQuery) {
			query = placeQuery;
			void searchPlace().then(() => searchClimateByPlaceSuggestion());
		}
	});
</script>

<Seo title={m.utils_weather_title()} description={m.utils_weather_description()} />

<section
	class="from-background to-secondary relative isolate flex h-full flex-col items-center gap-8 bg-linear-to-t p-5 pb-20 select-none"
>
	<CloudyBackground />

	<div class="mt-35 flex flex-col items-center">
		<h1 class="text-primary pb-20 text-3xl font-bold md:text-6xl">
			{m.utils_weather_h1()}
		</h1>
		<Card.Root class="max-w-block-width w-full">
			<Card.Content>
				<div
					class="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center"
					onfocusin={() => {
						if (suggestions.length > 0) listOpen = true;
					}}
					onfocusout={(e) => {
						if (!e.currentTarget.contains(e.relatedTarget as Node | null)) listOpen = false;
					}}
				>
					<div class="relative min-w-0 flex-1">
						<Input
							bind:value={query}
							oninput={() => searchPlace()}
							placeholder={m.utils_weather_placeholder()}
							autocomplete="off"
							role="combobox"
							aria-expanded={listOpen}
							aria-controls="weather-suggestions"
							class="pr-9"
						/>
						{#if listOpen}
							<ul
								id="weather-suggestions"
								role="listbox"
								class="bg-popover text-popover-foreground absolute top-full right-0 left-0 z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-md border p-1 shadow-lg"
							>
								{#each suggestions as place, i (place.displayName)}
									<li role="presentation" class="p-0.5">
										<button
											type="button"
											role="option"
											aria-selected={false}
											class="hover:bg-accent/60 flex w-full cursor-pointer items-start gap-2 rounded-sm px-2 py-2 text-left text-sm select-none"
											onclick={() => void searchClimateByPlaceSuggestion(i)}
										>
											<MapPin class="text-muted-foreground mt-0.5 h-full shrink-0" />
											<span class="min-w-0">
												<span class="block truncate font-medium">{place.name}</span>
												{#if place.label}
													<span class="text-muted-foreground block truncate text-xs"
														>{place.label}</span
													>
												{/if}
											</span>
										</button>
									</li>
								{/each}
							</ul>
						{/if}
					</div>

					<div class="flex gap-4">
						<Tooltip.Root>
							<Tooltip.Trigger>
								{#snippet child({ props })}
									<Button
										{...props}
										class="shrink-0"
										variant="outline"
										aria-label={m.utils_weather_location()}
										onclick={() => {
											navigator.geolocation.getCurrentPosition(async ({ coords }) => {
												const place = await searchPlaceByCoords(coords.latitude, coords.longitude, {
													acceptLanguage: locale
												});
												if (!place) return;
												suggestions = [place];
												void searchClimateByPlaceSuggestion(0);
											});
										}}
									>
										<MapPin />
									</Button>
								{/snippet}
							</Tooltip.Trigger>
							<Tooltip.Content>
								{m.utils_weather_location()}
							</Tooltip.Content>
						</Tooltip.Root>
						<Button
							class="flex-1 shrink-0"
							onclick={() => void searchPlace().then(() => searchClimateByPlaceSuggestion())}
							disabled={query.trim().length < MIN_QUERY_LENGTH}
						>
							{m.utils_weather_cta_search_button()}
							<ArrowBigRight />
						</Button>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	{#if waitingWeatherResponse || weather != null}
		<WeatherLayout {weather} {weatherPlace} />
	{/if}
</section>
