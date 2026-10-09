const SCRIPT_SRC = 'https://vlibras.gov.br/app/vlibras-plugin.js';
const WRAPPER_ID = 'vlibras-access-wrapper';
const APP_ROOT_ID = 'vlibras-app-root';
const APP_HOST_ID = 'vlibras-host';

type VLibrasApi = { open?: () => void };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const api = () => (window as unknown as { VLibrasWidget?: VLibrasApi }).VLibrasWidget;
const appRoot = () => document.getElementById(APP_ROOT_ID);

let readyPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
	if (readyPromise) return readyPromise;

	readyPromise = (async () => {
		await new Promise<void>((resolve, reject) => {
			const script = document.createElement('script');
			script.src = SCRIPT_SRC;
			script.async = true;
			script.onload = () => resolve();
			script.onerror = () => reject(new Error('VLibras: falha ao carregar o plugin'));
			document.body.appendChild(script);
		});

		// o plugin monta a pastilha num setTimeout(50) e só então expõe open()
		for (let i = 0; i < 40 && !api()?.open; i++) await sleep(100);

		// o controle é o nosso botão, então a pastilha própria do plugin nunca aparece
		document.getElementById(WRAPPER_ID)?.style.setProperty('display', 'none', 'important');
	})();

	return readyPromise;
}

/** O app do VLibras se posiciona com z-index 2147483647; sem contexto próprio ele cobre o nosso popover (z-50). */
function confineStacking() {
	const root = appRoot();
	if (!root) return;

	let host = document.getElementById(APP_HOST_ID);
	if (!host) {
		host = document.createElement('div');
		host.id = APP_HOST_ID;
		host.style.cssText = 'position: relative; z-index: 40;';
		document.body.appendChild(host);
	}

	if (root.parentElement !== host) host.appendChild(root);
}

export async function openLibras(): Promise<void> {
	if (typeof document === 'undefined') return;

	await loadScript();
	api()?.open?.();

	for (let i = 0; i < 100 && !appRoot(); i++) await sleep(200);
	confineStacking();
}

export function closeLibras(): void {
	if (typeof document === 'undefined') return;

	appRoot()?.setAttribute('data-active', 'false');
}
