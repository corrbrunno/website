/**
 * Client-side weather for Open-Meteo (https://open-meteo.com).
 *
 * Free tier: non-commercial only, CC-BY 4.0, up to 10 000 requests/day.
 * This page fires at most one request per selected place and caches the
 * result by rounded coordinates, so a browsing session stays in the low
 * single digits.
 */
import { fetchWeatherApi } from 'openmeteo';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Variable order in each block MUST match the order of the comma-separated
 * strings below — the FlatBuffers response is decoded by index.
 */
const CURRENT_VARIABLES = [
	'temperature_2m',
	'apparent_temperature',
	'relative_humidity_2m',
	'precipitation',
	'weather_code',
	'wind_speed_10m',
	'wind_direction_10m'
];
const HOURLY_VARIABLES = ['temperature_2m', 'precipitation_probability', 'precipitation'];
const DAILY_VARIABLES = [
	'weather_code',
	'temperature_2m_max',
	'temperature_2m_min',
	'precipitation_sum',
	'precipitation_probability_max',
	'precipitation_probability_min',
	'wind_speed_10m_max'
];
const MAX_TIME_STEPS = 200;

export interface CurrentConditions {
	temperature: number | null;
	apparentTemperature: number | null;
	humidity: number | null;
	precipitation: number | null;
	weatherCode: number | null;
	windSpeed: number | null;
	windDirection: number | null;
}

export interface HourlyPoint {
	/** Unix seconds shifted by the location UTC offset (format with timeZone: 'UTC'). */
	localEpoch: number;
	temperature: number | null;
	/** Probabilidade de precipitação (0–100 %). */
	precipitationProbability: number | null;
	precipitation: number | null;
}

export interface DailyPoint {
	localEpoch: number;
	weatherCode: number | null;
	temperatureMax: number | null;
	temperatureMin: number | null;
	precipitationSum: number | null;
	/** Maior probabilidade de precipitação do dia (0–100 %). */
	precipitationProbabilityMax: number | null;
	/** Menor probabilidade de precipitação do dia (0–100 %). */
	precipitationProbabilityMin: number | null;
	windSpeedMax: number | null;
}

export interface WeatherData {
	current: CurrentConditions;
	/** Epoch of the "current" measurement (same local-shift convention). */
	currentTimeLocal: number | null;
	hourly: HourlyPoint[];
	daily: DailyPoint[];
	utcOffsetSeconds: number;
}

type WeatherApiResponse = Awaited<ReturnType<typeof fetchWeatherApi>>[number];

const cache = new Map<string, WeatherData>();

export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherData> {
	const cacheKey = `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
	const cached = cache.get(cacheKey);
	if (cached) return cached;

	const [response] = await fetchWeatherApi(
		FORECAST_URL,
		{
			latitude,
			longitude,
			current: CURRENT_VARIABLES.join(','),
			hourly: HOURLY_VARIABLES.join(','),
			daily: DAILY_VARIABLES.join(','),
			timezone: 'auto',
			timeformat: 'unixtime',
			forecast_days: 5,
			wind_speed_unit: 'kmh',
			precipitation_unit: 'mm'
		},
		2
	);

	const data = parse(response);
	cache.set(cacheKey, data);
	return data;
}

function parse(response: WeatherApiResponse): WeatherData {
	const utcOffsetSeconds = Number(response.utcOffsetSeconds());
	const shift = (epoch: number) => epoch + utcOffsetSeconds;

	const currentBlock = response.current();
	if (!currentBlock || currentBlock.variablesLength() < CURRENT_VARIABLES.length) {
		throw new Error('Open-Meteo: resposta incompleta');
	}
	const currentVar = (index: number) => {
		const value = currentBlock.variables(index)?.value();
		return typeof value === 'number' && Number.isFinite(value) ? value : null;
	};

	const currentTime = Number(currentBlock.time());
	const hourly = readHourly(response.hourly(), shift);
	const daily = readDaily(response.daily(), shift);

	return {
		current: {
			temperature: currentVar(0),
			apparentTemperature: currentVar(1),
			humidity: currentVar(2),
			precipitation: currentVar(3),
			weatherCode: currentVar(4),
			windSpeed: currentVar(5),
			windDirection: currentVar(6)
		},
		currentTimeLocal: Number.isFinite(currentTime) ? shift(currentTime) : null,
		hourly,
		daily,
		utcOffsetSeconds
	};
}

function readHourly(
	block: ReturnType<WeatherApiResponse['hourly']>,
	shift: (epoch: number) => number
): HourlyPoint[] {
	const points: HourlyPoint[] = [];
	if (!block) return points;
	assertVariableCount(block, HOURLY_VARIABLES.length);

	const start = Number(block.time());
	const interval = block.interval() || 3600;
	const steps = timeSteps(block, interval);
	const temperatures = block.variables(0)?.valuesArray();
	const probabilities = block.variables(1)?.valuesArray();
	const precipitation = block.variables(2)?.valuesArray();

	for (let i = 0; i < steps; i++) {
		points.push({
			localEpoch: shift(start + i * interval),
			temperature: at(temperatures, i),
			precipitationProbability: at(probabilities, i),
			precipitation: at(precipitation, i)
		});
	}
	return points;
}

function readDaily(
	block: ReturnType<WeatherApiResponse['daily']>,
	shift: (epoch: number) => number
): DailyPoint[] {
	const points: DailyPoint[] = [];
	if (!block) return points;
	assertVariableCount(block, DAILY_VARIABLES.length);

	const start = Number(block.time());
	const interval = block.interval() || 86400;
	const steps = timeSteps(block, interval);
	const codes = block.variables(0)?.valuesArray();
	const maxTemps = block.variables(1)?.valuesArray();
	const minTemps = block.variables(2)?.valuesArray();
	const precipitation = block.variables(3)?.valuesArray();
	const probMax = block.variables(4)?.valuesArray();
	const probMin = block.variables(5)?.valuesArray();
	const wind = block.variables(6)?.valuesArray();

	for (let i = 0; i < steps; i++) {
		points.push({
			localEpoch: shift(start + i * interval),
			weatherCode: at(codes, i),
			temperatureMax: at(maxTemps, i),
			temperatureMin: at(minTemps, i),
			precipitationSum: at(precipitation, i),
			precipitationProbabilityMax: at(probMax, i),
			precipitationProbabilityMin: at(probMin, i),
			windSpeedMax: at(wind, i)
		});
	}
	return points;
}

function timeSteps(
	block: NonNullable<ReturnType<WeatherApiResponse['hourly']>>,
	fallbackInterval: number
): number {
	const start = Number(block.time());
	const end = Number(block.timeEnd());
	if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
	const interval = block.interval() || fallbackInterval;
	return Math.min(Math.floor((end - start) / interval) + 1, MAX_TIME_STEPS);
}

function assertVariableCount(
	block: NonNullable<ReturnType<WeatherApiResponse['hourly']>>,
	expected: number
): void {
	if (block.variablesLength() < expected) {
		throw new Error('Open-Meteo: no variables on response');
	}
}

function at(values: number[] | Float32Array | null | undefined, index: number): number | null {
	const value = values?.[index];
	return typeof value === 'number' && Number.isFinite(value) ? value : null;
}
