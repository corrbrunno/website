<script lang="ts">
  import * as m from '$lib/paraglide/messages';
  import { page } from '$app/stores';
	import { deLocalizeUrl, localizeHref } from '$lib/paraglide/runtime';

	// ---------- Tipos JSON-LD ----------
	// inLanguage é válido no schema.org apenas em CreativeWork e subtipos
	// (WebPage, ProfilePage, Article, Blog, FAQPage). Person e Service NÃO
	// aceitam — nesses casos a linguagem fica no nó de página que envolve.
	export type JsonLdNodeBase = {
		'@context': string;
		'@type': string;
		[key: string]: unknown;
	};

	export type JsonLd = JsonLdNodeBase & { inLanguage: string };

	export type PostalAddressJsonLd = {
		'@type': 'PostalAddress';
		addressLocality: string;
		addressRegion: string;
		addressCountry: string;
	};

	export type OrganizationJsonLd = {
		'@type': 'Organization' | 'GovernmentOrganization' | 'CollegeOrUniversity';
		name: string;
		url?: string;
	};

	export type PersonRefJsonLd = {
		'@type': 'Person';
		name: string;
		url?: string;
	};

	export type OfferJsonLd = {
		'@type': 'Offer';
		name?: string;
		description?: string;
		price?: number;
		priceCurrency?: string;
	};

	export type AggregateOfferJsonLd = {
		'@type': 'AggregateOffer';
		lowPrice?: number;
		highPrice?: number;
		priceCurrency?: string;
		offerCount?: number;
		offers?: OfferJsonLd[];
	};

	export type WebPageJsonLd = JsonLd & {
		'@type': 'WebPage';
		name?: string;
		url?: string;
		mainEntity?: { '@id': string };
	};

	export type ProfilePageJsonLd = JsonLd & {
		'@type': 'ProfilePage';
		name?: string;
		url?: string;
		mainEntity?: { '@id': string };
	};

	export type PersonJsonLd = JsonLdNodeBase & {
		'@type': 'Person';
		'@id'?: string;
		name: string;
		url?: string;
		image?: string;
		jobTitle?: string;
		description?: string;
		address?: PostalAddressJsonLd;
		knowsAbout?: string[];
		worksFor?: OrganizationJsonLd | OrganizationJsonLd[];
		alumniOf?: OrganizationJsonLd;
		sameAs?: string[];
	};

	export type ServiceJsonLd = JsonLdNodeBase & {
		'@type': 'Service';
		'@id'?: string;
		name: string;
		description?: string;
		serviceType?: string;
		provider?: PersonRefJsonLd;
		areaServed?: string;
		offers?: OfferJsonLd | OfferJsonLd[] | AggregateOfferJsonLd;
	};

	export type BlogPostingJsonLd = JsonLd & {
		'@type': 'BlogPosting';
		headline: string;
		description?: string;
		datePublished?: string;
		dateModified?: string;
		author?: PersonRefJsonLd;
	};

	export type BlogJsonLd = JsonLd & {
		'@type': 'Blog';
		name?: string;
		url?: string;
		blogPost?: {
			'@type': 'BlogPosting';
			headline: string;
			url: string;
			datePublished?: string;
		}[];
	};

	export type FAQPageJsonLd = JsonLd & {
		'@type': 'FAQPage';
		mainEntity: {
			'@type': 'Question';
			name: string;
			acceptedAnswer: { '@type': 'Answer'; text: string };
		}[];
	};

	export type JsonLdNode =
		| WebPageJsonLd
		| ProfilePageJsonLd
		| PersonJsonLd
		| ServiceJsonLd
		| BlogPostingJsonLd
		| BlogJsonLd
		| FAQPageJsonLd;

  let {
    title,
    description,
    image = "",
    type = "website",
    publishedTime = "",
    children
  }: {
    title: string;
    description: string;
    image?: string;
    type?: "website" | "article" | "profile";
    publishedTime?: string;
    children?: JsonLdNode | JsonLdNode[];
  } = $props();

  const siteUrl = "https://corrbrunno.dev.br";
  const path = deLocalizeUrl($page.url).pathname;
  const fullUrl = `${siteUrl}${$page.url.pathname}`;
  const ogImage = $derived(image ? `${siteUrl}${image}` : `${siteUrl}/og-default.webp`);

  // Normaliza pra sempre ser array — inLanguage é responsabilidade de quem chama
  let jsonldItems: JsonLdNode[] = $derived(
  children ? (Array.isArray(children) ? children : [children])
  : []);

</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={fullUrl} />
  <meta property="og:type" content={type} />
  <meta property="og:site_name" content={m.seo_sitename()} />
  <meta property="og:locale" content={$page.url.pathname.startsWith('/en') ? "en_US" : "pt_BR"} />
  <meta property="og:image" content={ogImage} />

  <meta name="twitter:card" content={type === "article" ? "summary_large_image" : "summary"} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />

  {#if publishedTime}
    <meta property="article:published_time" content={publishedTime} />
    <meta property="article:author" content={m.seo_sitename()} />
  {/if}

  <link rel="canonical" href={fullUrl} />

  <link rel="alternate" hreflang="pt-BR" href={localizeHref(path, {locale: "pt-br"})} />
  <link rel="alternate" hreflang="en" href={localizeHref(path, {locale: "en"})} />
  <link rel="alternate" hreflang="x-default" href={localizeHref(path, {locale: "pt-br"})} />

  {#if jsonldItems.length}
    {@html `<script type="application/ld+json">${JSON.stringify(jsonldItems.length === 1 ? jsonldItems[0] : jsonldItems).replace(/</g, '\\u003c')}</script>`}
  {/if}
</svelte:head>
