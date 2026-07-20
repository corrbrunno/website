<script lang="ts">
  import * as m from '$lib/paraglide/messages';
  import { page } from '$app/stores';
	import { localizeHref } from '$lib/paraglide/runtime';

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
    children?: Record<string, unknown> | Record<string, unknown>[];
  } = $props();

  const siteUrl = "https://corrbrunno.dev.br";
  const fullUrl = `${siteUrl}${$page.url.pathname}`;
  const ogImage = $derived(image ? `${siteUrl}${image}` : `${siteUrl}/og-default.png`);

  // Normaliza pra sempre ser array
  let jsonldItems: Record<string, unknown>[] = $derived(
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

  <link rel="alternate" hreflang="pt-BR" href={localizeHref("", {locale: "pt-br"})} />
  <link rel="alternate" hreflang="en" href={localizeHref("", {locale: "en"})} />
  <link rel="alternate" hreflang="x-default" href={localizeHref("", {locale: "pt-br"})} />

  {#if jsonldItems.length}
    <script type="application/ld+json">
      {@html JSON.stringify(jsonldItems.length === 1 ? jsonldItems[0] : jsonldItems)}
    </script>
  {/if}
</svelte:head>