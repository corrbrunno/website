import { getLocale } from "$lib/paraglide/runtime";
import { SUPPORTED_LANGUAGES } from "./constants";

export function getSelectedLanguage() {
	return SUPPORTED_LANGUAGES.find((lang) => lang.locale === getLocale()) ?? SUPPORTED_LANGUAGES[0];
}
