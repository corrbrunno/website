import { paraglideVitePlugin } from '@inlang/paraglide-js'
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [paraglideVitePlugin({ 
		project: './project.inlang',
		 outdir: './src/lib/paraglide',
		strategy: ["url","baseLocale"] }),tailwindcss(), sveltekit()],
	server:{
		host: "0.0.0.0",
		port: 8443,
		allowedHosts: ["corrbrunno.tail84cca9.ts.net"]
	}
});
