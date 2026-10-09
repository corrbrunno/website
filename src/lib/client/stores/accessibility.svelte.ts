const FONT_SCALE_KEY = 'a11y:font-scale';
const LIBRAS_KEY = 'a11y:libras';

export const FONT_SCALE_DEFAULT = 100;
export const FONT_SCALE_STEPS = [87.5, 100, 112.5, 125, 150];

function readFontScale(): number {
	if (typeof localStorage === 'undefined') return FONT_SCALE_DEFAULT;

	const stored = Number(localStorage.getItem(FONT_SCALE_KEY));
	return FONT_SCALE_STEPS.includes(stored) ? stored : FONT_SCALE_DEFAULT;
}

function readLibras(): boolean {
	if (typeof localStorage === 'undefined') return false;
	return localStorage.getItem(LIBRAS_KEY) === 'true';
}

function applyFontScale(value: number) {
	if (typeof document === 'undefined') return;
	document.documentElement.style.setProperty('--font-scale', `${value}%`);
}

export const accessibility = $state({
	fontScale: readFontScale(),
	libras: readLibras()
});

export function setFontScale(value: number) {
	accessibility.fontScale = value;
	applyFontScale(value);

	if (typeof localStorage !== 'undefined') localStorage.setItem(FONT_SCALE_KEY, String(value));
}

export function stepFontScale(direction: 1 | -1) {
	const index = FONT_SCALE_STEPS.indexOf(accessibility.fontScale);
	const next = Math.min(Math.max(index + direction, 0), FONT_SCALE_STEPS.length - 1);

	setFontScale(FONT_SCALE_STEPS[next]);
}

export function setLibras(enabled: boolean) {
	accessibility.libras = enabled;

	if (typeof localStorage !== 'undefined') localStorage.setItem(LIBRAS_KEY, String(enabled));
}
