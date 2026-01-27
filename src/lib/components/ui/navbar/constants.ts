import { HouseIcon, SquareUserRound, NotebookPen } from "@lucide/svelte";
import * as m from '$lib/paraglide/messages';

export const NAVEGATION_BUTTONS = [
    { slug: m.nav_home(), url: '/', icon: HouseIcon },
    { slug: m.nav_about(), url: '/#about', icon: SquareUserRound },
    { slug: m.nav_blog(), url: '/blog', icon: NotebookPen },
];