import { HouseIcon, SquareUserRound, NotebookPen, Bot, Book, MonitorCloud } from "@lucide/svelte";
import * as m from '$lib/paraglide/messages';

export const NAVEGATION_BUTTONS = [
    { slug: m.nav_home(), url: '/', icon: HouseIcon },
    { slug: m.nav_about(), url: '/#about', icon: SquareUserRound },
    { slug: m.nav_blog(), url: '/blog', icon: NotebookPen },
];

export const SERVICE_PAGES = [
    {slug: m.nav_pricing_automation, url: "/pricing/automations", icon: Bot},
    {slug: m.nav_pricing_class, url: "/pricing/classes", icon: Book},
    {slug: m.nav_pricing_website, url: "/pricing/websites", icon: MonitorCloud}
]

export const SUPPORTED_LANGUAGES = [
    { lang: m.language_portuguese, locale: "pt-br", emoji: ``}
]