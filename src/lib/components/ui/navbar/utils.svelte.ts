import { getLocale } from "$lib/paraglide/runtime";
import { SUPPORTED_LANGUAGES } from "./constants";

const selectedLanguage = $derived(
		SUPPORTED_LANGUAGES.filter((lang) => lang.locale == getLocale())[0]
);

export function getSelectedLanguage(){
	return selectedLanguage;
}