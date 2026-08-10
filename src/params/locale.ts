import type { ParamMatcher } from '@sveltejs/kit';

export const match:  ParamMatcher = (param) => param === 'pt-br' || param === 'en';
