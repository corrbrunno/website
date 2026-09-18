<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import {
		Cloud,
		CloudDrizzle,
		CloudFog,
		CloudLightning,
		CloudRain,
		CloudRainWind,
		CloudSnow,
		CloudSun,
		Droplets,
		MapPin,
		Sun
	} from '@lucide/svelte';
	import type { Component } from 'svelte';
	import type { PlaceSuggestion } from '$lib/client/api/geocoding';
	import type { WeatherData } from '$lib/client/api/weather';
	import { Button } from '$lib/components/ui/button';

	let {
		weather = null,
		weatherPlace = null
	}: {
		weather?: WeatherData | null;
		weatherPlace?: PlaceSuggestion | null;
	} = $props();

	const HOUR = 3600;
	const DAY = HOUR * 24;
	const HOURLY_PLACEHOLDER_COUNT = 8;
	const DAILY_PLACEHOLDER_COUNT = 5;
	const hourlyPlaceholders = Array.from({ length: HOURLY_PLACEHOLDER_COUNT });
	const dailyPlaceholders = Array.from({ length: DAILY_PLACEHOLDER_COUNT });

	const locale = getLocale();

	// ---- WMO icon (weather_code) → lucide component -------------------------

	type IconComponent = Component<{ class?: string }>;
	const WMO_ICONS: Record<number, IconComponent> = {
		0: Sun,
		1: Sun,
		2: CloudSun,
		3: Cloud,
		45: CloudFog,
		48: CloudFog,
		51: CloudDrizzle,
		53: CloudDrizzle,
		55: CloudDrizzle,
		56: CloudDrizzle,
		57: CloudDrizzle,
		61: CloudRain,
		63: CloudRain,
		65: CloudRain,
		66: CloudRain,
		67: CloudRain,
		71: CloudSnow,
		73: CloudSnow,
		75: CloudSnow,
		77: CloudSnow,
		80: CloudRainWind,
		81: CloudRainWind,
		82: CloudRainWind,
		85: CloudSnow,
		86: CloudSnow,
		95: CloudLightning,
		96: CloudLightning,
		99: CloudLightning
	};

	function weatherIcon(code: number | null | undefined): IconComponent {
		return code != null && code in WMO_ICONS ? WMO_ICONS[code] : Cloud;
	}

	/** "Now" in UTC */
	let nowLocalEpoch = $derived(
		weather ? Math.floor(Date.now() / 1000) + weather.utcOffsetSeconds : 0
	);

	function localDayStart(localEpoch: number): number {
		const date = new Date(localEpoch * 1000);
		return Math.floor(
			Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 1000
		);
	}

	let hourlyWindow = $derived.by(() => {
		if (!weather) return [];
		const dayStart = localDayStart(nowLocalEpoch);
		const start = dayStart - DAY; // 00:00AM day before
		const end = dayStart + DAY + 2 * HOUR; // 02:00AM next day
		return weather.hourly.filter((hour) => hour.localEpoch >= start && hour.localEpoch <= end);
	});

	$effect(() => {
		if (!weather || hourlyWindow.length === 0) return;
		document.getElementById('hour-now')?.scrollIntoView({
			inline: 'center',
			block: 'nearest'
		});
	});

	function formatTime(epochSeconds: number, options: Intl.DateTimeFormatOptions = {}): string {
		return new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(
			new Date(epochSeconds * 1000)
		);
	}

	const hourLabel = (epoch: number) => formatTime(epoch, { hour: '2-digit', minute: '2-digit' });
	const dayLabel = (epoch: number) => formatTime(epoch, { weekday: 'short' });
	const dateLabel = (epoch: number) =>
		formatTime(epoch, { weekday: 'long', day: 'numeric', month: 'long' });

	function tempText(value: number | null): string {
		return value == null ? '—' : `${Math.round(value)}°`;
	}

	function amountText(value: number | null): string {
		return value == null ? '—' : `${value.toFixed(1)} mm`;
	}

	function text<V extends Object>(
		value: V | null | undefined,
		nonNullMap: ((value: V) => string) | null = (value) => value.toString()
	): string {
		return value == null || value == undefined
			? '—'
			: nonNullMap != null
				? nonNullMap(value)
				: value.toString();
	}

	const CARDINALS_PT = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'] as const;
	const CARDINALS_EN = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

	function windDirection(degrees: number | null): string {
		if (degrees == null) return '';
		const cardinals = locale === 'pt-br' ? CARDINALS_PT : CARDINALS_EN;
		const index = Math.round((((degrees % 360) + 360) % 360) / 45) % 8;
		return cardinals[index] ?? '';
	}
</script>

{#snippet hourlySnippet(
	localEpoch?: number | null,
	temperature?: number | null,
	precipitationProbability?: number | null,
	precipitation?: number | null,
	isNewDay?: boolean,
	isNow?: boolean,
	isPast?: boolean
)}
	<div
		id={isNow ? 'hour-now' : undefined}
		class="flex min-w-16 flex-col items-center justify-between gap-1 rounded-xl border px-2 py-2 transition-opacity {localEpoch !==
			undefined && !isPast
			? 'opacity-40'
			: ''} {isNow ? 'shadow-primary shadow-2xl' : ''}"
	>
		{#if localEpoch === undefined}
			<Skeleton class="h-4 w-10" />
		{:else if isNewDay}
			<span class="text-muted-foreground text-[10px] font-medium uppercase">
				{text(localEpoch, (dle) => dayLabel(dle))}
			</span>
		{:else}
			<span
				class="text-xs tabular-nums {isPast ? 'text-muted-foreground/70' : 'text-muted-foreground'}"
			>
				{text(localEpoch, (hle) => hourLabel(hle))}
			</span>
		{/if}

		{#if temperature === undefined}
			<Skeleton class="h-5 w-7" />
		{:else}
			<span class="text-sm font-semibold tabular-nums">
				{text(temperature, (ht) => tempText(ht))}
			</span>
		{/if}

		{#if precipitationProbability === undefined}
			<span class="flex flex-col items-center gap-0.5 text-xs tabular-nums">
				<Skeleton class="size-3.5" />
				<Skeleton class="h-4 w-6" />
				{#if precipitation === undefined}
					<Skeleton class="h-4 w-8" />
				{/if}
			</span>
		{:else}
			<span class="flex flex-col items-center gap-0.5 text-xs tabular-nums">
				{#if precipitationProbability != null}
					<Droplets class="size-3.5 shrink-0 text-sky-500" />
					{text(precipitationProbability, (hpp) => `${Math.round(hpp)}%`)}
				{:else}
					<span class="text-muted-foreground/60">0.0</span>
				{/if}
				{#if precipitation != null}
					{@const fixedPrecipitation = precipitation}
					<span class="text-muted-foreground/70"
						>{text(precipitation, (hp) =>
							fixedPrecipitation != 0 ? `${hp.toFixed(1)} mm` : '-'
						)}</span
					>
				{/if}
			</span>
		{/if}
	</div>
{/snippet}

{#snippet dailySnippet(
	weatherCode?: number | null,
	localEpoch?: number | null,
	temperatureMax?: number | null,
	temperatureMin?: number | null,
	precipitationSum?: number | null,
	precipitationProbabilityMax?: number | null
)}
	{@const DayIcon = weatherIcon(weatherCode)}
	<div class="flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center md:w-full">
		{#if localEpoch === undefined}
			<Skeleton class="h-4 w-12" />
		{:else}
			<span class="text-xs font-medium">{text(localEpoch, (dle) => dayLabel(dle))}</span>
		{/if}

		{#if weatherCode === undefined}
			<Skeleton class="size-6 rounded-full" />
		{:else}
			<DayIcon class="text-primary size-6" />
		{/if}

		<div class="flex items-center justify-center gap-1.5 text-sm">
			{#if temperatureMax === undefined}
				<Skeleton class="h-5 w-7" />
			{:else}
				<span class="font-semibold tabular-nums"
					>{text(temperatureMax, (dtm) => tempText(dtm))}</span
				>
			{/if}
			{#if temperatureMin === undefined}
				<Skeleton class="h-5 w-7" />
			{:else}
				<span class="text-muted-foreground tabular-nums">
					{text(temperatureMin, (dtn) => tempText(dtn))}
				</span>
			{/if}
		</div>

		<div class="text-muted-foreground flex items-center justify-center gap-1 text-xs tabular-nums">
			{#if precipitationSum === undefined}
				<Skeleton class="size-3 shrink-0" />
				<Skeleton class="h-4 w-10" />
			{:else}
				<Droplets class="size-3 shrink-0 text-sky-500" />
				<span>{text(precipitationSum, (dps) => `${dps.toFixed(1)} mm`)}</span>
			{/if}
			{#if precipitationProbabilityMax === undefined}
				<Skeleton class="h-4 w-6" />
			{:else}
				<span>{text(precipitationProbabilityMax, (dppm) => `${Math.round(dppm)}%`)}</span>
			{/if}
		</div>
	</div>
{/snippet}

<Card.Root class="max-w-block-width w-full">
	<Card.Header>
		<Card.Title class="animate-in fade-in blur-in-sm flex items-center gap-2 duration-600">
			<MapPin class="text-primary size-5 shrink-0" />
			{text(weatherPlace, (wp) => wp.displayName)}
		</Card.Title>
		<Card.Description>
			{text(weather?.currentTimeLocal, (ctl) => dateLabel(ctl))}
		</Card.Description>
	</Card.Header>
	<Card.Content class="flex flex-col gap-6">
		<div class="flex flex-col items-center gap-6 sm:flex-row">
			<div class="flex items-center gap-4 self-start">
				<div class="bg-background/70 flex size-20 items-center justify-center rounded-2xl border">
					{#if weather}
						{@const CurrentIcon = weatherIcon(weather.current.weatherCode)}
						<CurrentIcon
							class="text-primary animate-in fade-in -spin-in-45 size-10 duration-700  ease-out"
						/>
					{:else}
						<Skeleton class="size-full" />
					{/if}
				</div>
				<p class="text-6xl font-bold tabular-nums">
					{text(weather?.current.temperature, (wct) => tempText(wct))}
				</p>
			</div>
			<dl class="flex flex-1 justify-center">
				<div class="flex flex-wrap justify-between gap-x-9 gap-y-3 text-sm *:gap-x-8">
					<div class="flex max-w-full flex-1 justify-between">
						<div>
							<dt class="text-muted-foreground text-xs">{m.utils_weather_feels_like()}</dt>
							<dd class="font-medium tabular-nums">
								{text(weather?.current.apparentTemperature, (wcaT) => tempText(wcaT))}
							</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-xs">{m.utils_weather_precipitation()}</dt>
							<dd class="font-medium tabular-nums">
								{text(weather?.current.precipitation, (wcp) => amountText(wcp))}
							</dd>
						</div>
					</div>
					<div class="flex max-w-full flex-1 justify-between">
						<div>
							<dt class="text-muted-foreground text-xs">{m.utils_weather_wind()}</dt>
							<dd class="font-medium text-nowrap tabular-nums">
								{text(weather?.current.windSpeed, (wcws) => `${Math.round(wcws)} km/h`)}
								{#if weather?.current.windDirection != null}
									<span class="text-muted-foreground ml-1">
										{windDirection(weather.current.windDirection)}
									</span>
								{/if}
							</dd>
						</div>
						<div>
							<dt class="text-muted-foreground text-xs">{m.utils_weather_humidity()}</dt>
							<dd class="font-medium tabular-nums">
								{text(weather?.current.humidity, (wch) => `${Math.round(wch)}%`)}
							</dd>
						</div>
					</div>
				</div>
			</dl>
		</div>

		<section>
			<h3 class="mb-2 text-sm font-semibold">{m.utils_weather_next_hours()}</h3>
			{#if weather && hourlyWindow.length > 0}
				<div class="flex gap-2 overflow-x-auto pb-1">
					{#each hourlyWindow as hour, i}
						{@const isNewDay =
							i === 0 ||
							Math.floor(hour.localEpoch / DAY) !==
								Math.floor(hourlyWindow[i - 1].localEpoch / DAY)}
						{@const isNow =
							hour.localEpoch <= nowLocalEpoch && nowLocalEpoch < hour.localEpoch + HOUR}
						{@const isPast = hour.localEpoch <= nowLocalEpoch}
						{@render hourlySnippet(
							hour.localEpoch,
							hour.temperature,
							hour.precipitationProbability,
							hour.precipitation,
							isNewDay,
							isNow,
							isPast
						)}
					{/each}
				</div>
			{:else}
				<div class="flex gap-2 overflow-x-auto pb-1">
					{#each hourlyPlaceholders as _}
						{@render hourlySnippet()}
					{/each}
				</div>
			{/if}
		</section>

		<section>
			<h3 class="mb-2 text-sm font-semibold">{m.utils_weather_next_days()}</h3>
			{#if weather && weather.daily.length > 0}
				<div class="grid grid-cols-2 flex-wrap justify-evenly gap-2 md:grid-cols-3">
					{#each weather.daily as day}
						{@render dailySnippet(
							day.weatherCode,
							day.localEpoch,
							day.temperatureMax,
							day.temperatureMin,
							day.precipitationSum,
							day.precipitationProbabilityMax
						)}
					{/each}
				</div>
			{:else}
				<div class="grid grid-cols-2 flex-wrap justify-evenly gap-2 md:grid-cols-3">
					{#each dailyPlaceholders as _}
						{@render dailySnippet()}
					{/each}
				</div>
			{/if}
		</section>

		<footer
			class="text-muted-foreground flex flex-wrap items-center justify-between gap-1 border-t pt-3 text-xs"
		>
			<span>{m.utils_weather_attribution_osm()}</span>
			<Button
				class="max-w-full min-w-0 p-0"
				variant="link"
				href="https://open-meteo.com/"
				target="_blank"
				rel="noreferrer"
			>
				<span class="block truncate">{m.utils_weather_attribution_om()}</span>
			</Button>
		</footer>
	</Card.Content>
</Card.Root>
