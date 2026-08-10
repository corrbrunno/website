import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server';

// /pt-br/qualquer-coisa -> /qualquer-coisa (idioma base nao tem prefixo)
const ptBrRedirect: Handle = ({ event, resolve }) => {
	const { pathname } = new URL(event.request.url);
	if (/^\/pt-br(\/|$)/i.test(pathname)) {
		throw redirect(308, pathname.replace(/^\/pt-br/i, '') || '/');
	}
	return resolve(event);
};

// creating a handle to use the paraglide middleware
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('%lang%', locale);
			}
		});
	});

export const handle: Handle = sequence(ptBrRedirect, paraglideHandle);
