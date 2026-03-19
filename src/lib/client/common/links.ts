import { Github, Instagram, Linkedin } from '@lucide/svelte';
import * as m from '$lib/paraglide/messages.js'; // Exemplo de import do paraglide

export const socialMediaLinks = [
    { 
        name: m.common_social_github_name, 
        alias: m.common_social_github_alias, 
        link: 'https://github.com/corrbrunno', 
        Icon: Github 
    },
    {
        name: m.common_social_linkedin_name,
        alias: m.common_social_linkedin_alias,
        link: 'https://www.linkedin.com/in/corr-brunno/',
        Icon: Linkedin
    },
    {
        name: m.common_social_instagram_name,
        alias: m.common_social_instagram_alias,
        link: 'https://www.instagram.com/brunno.corr/',
        Icon: Instagram
    }
];