<script>
	import { socialMediaLinks } from '$lib/client/common/links';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as m from '$lib/paraglide/messages';
	import { Mail, MapPin } from '@lucide/svelte';
	import AboutQrcode from './about-qrcode.svelte';

	const pageName = m.about_name;
	const titleRole = m.about_title_role;
	const sectionSummary = m.about_section_summary;
	const sectionSkills = m.about_section_skills;
	const sectionEducation = m.about_section_education;
	const sectionLanguages = m.about_section_languages;
	const sectionExperience = m.about_section_experience;

	const myInfo = [
		{ icon: MapPin, label: m.about_info_location },
		...socialMediaLinks.map(({ alias, Icon, link }) => ({ icon: Icon, label: alias, link })),
		{ icon: Mail, label: m.about_info_email }
	];

	const summary = m.about_summary;

	const skills = [
		{ category: m.about_skills_logic_cat, items: m.about_skills_logic_items },
		{ category: m.about_skills_web_cat, items: m.about_skills_web_items },
		{ category: m.about_skills_data_cat, items: m.about_skills_data_items },
		{ category: m.about_skills_infra_cat, items: m.about_skills_infra_items },
		{ category: m.about_skills_soft_cat, items: m.about_skills_soft_items }
	];

	const roles = [
		{
			name: m.about_role_instructor,
			company: m.about_role_instructor_company,
			date: m.about_role_instructor_date,
			achievements: [
				{
					name: m.about_role_instructor_ach1_name,
					description: m.about_role_instructor_ach1_desc
				},
				{
					name: m.about_role_instructor_ach2_name,
					description: m.about_role_instructor_ach2_desc
				}
			]
		},
		{
			name: m.about_role_dev,
			company: m.about_role_dev_company,
			date: m.about_role_dev_date,
			achievements: [
				{
					name: m.about_role_dev_ach1_name,
					description: m.about_role_dev_ach1_desc
				},
				{
					name: m.about_role_dev_ach2_name,
					description: m.about_role_dev_ach2_desc
				},
				{
					name: m.about_role_dev_ach3_name,
					description: m.about_role_dev_ach3_desc
				},
				{
					name: m.about_role_dev_ach4_name,
					description: m.about_role_dev_ach4_desc
				},
				{
					name: m.about_role_dev_ach5_name,
					description: m.about_role_dev_ach5_desc
				}
			]
		},
		{
			name: m.about_role_support,
			company: m.about_role_support_company,
			date: m.about_role_support_date,
			achievements: [
				{
					name: m.about_role_support_ach1_name,
					description: m.about_role_support_ach1_desc
				}
			]
		},
		{
			name: m.about_role_freelance,
			company: m.about_role_freelance_company,
			date: m.about_role_freelance_date,
			achievements: [
				{
					name: m.about_role_freelance_ach1_name,
					description: m.about_role_freelance_ach1_desc
				},
				{
					name: m.about_role_freelance_ach2_name,
					description: m.about_role_freelance_ach2_desc
				},
				{
					name: m.about_role_freelance_ach3_name,
					description: m.about_role_freelance_ach3_desc
				}
			]
		}
	];

	const education = [
		{
			degree: m.about_role_edu_degree,
			institution: m.about_edu_institution,
			date: m.about_role_edu_date
		}
	];

	const languages = [
		{ name: m.about_lang_en_name, level: m.about_lang_en_level },
		{ name: m.about_lang_pt_name, level: m.about_lang_pt_level }
	];
</script>

<div id="wrapper" class="max-w-content-width mx-auto my-10 flex flex-col gap-y-5 p-4 text-balance">
	<section class="flex items-start justify-between">
		<div class="flex flex-1 flex-col gap-y-3">
			<header>
				<h1 class="text-2xl font-bold"><strong>{pageName()}</strong></h1>
				<p class="text-lg">{titleRole()}</p>
			</header>

			<ul class="ml-4 flex flex-wrap gap-x-4 gap-y-1">
				{#each myInfo as info}
					<li class="flex gap-2">
						{#if 'link' in info && info.link}
							<a class="flex gap-2 hover:underline hover:text-primary" href={info.link}>
								<info.icon class="text-primary" />
								<p>{info.label()}</p>
							</a>
						{:else}
							<info.icon class="text-primary" />
							<p>{info.label()}</p>
						{/if}
					</li>
				{/each}
			</ul>
		</div>

		<div class="flex shrink-0 flex-col items-end">
			<Button variant="secondary" class="mb-2 print:hidden" onclick={() => window.print()}>
				Imprimir
			</Button>

			<div class="hidden h-24 w-24 print:block">
				<AboutQrcode />
			</div>
		</div>
	</section>
	<section>
		<h2><strong>{sectionSummary()}</strong></h2>
		<p>{summary()}</p>
	</section>

	<section class="flex flex-col gap-y-2">
		<h2><strong>{sectionSkills()}</strong></h2>
		<ul class="flex list-disc flex-col gap-1 pl-4">
			{#each skills as skill}
				<li>
					<p>
						<strong>{skill.category()}:</strong>
						{skill.items()};
					</p>
				</li>
			{/each}
		</ul>
	</section>

	<section class="flex flex-col gap-y-2">
		<h2><strong>{sectionEducation()}</strong></h2>
		{#each education as edu}
			<div class="ml-4">
				<h3 class="inline"><strong>{edu.degree()}</strong></h3>
				|
				<p class="text-primary inline">{edu.institution()}</p>
				<p class="text-sm opacity-50">{edu.date()}</p>
			</div>
		{/each}
	</section>

	<section class="flex flex-col gap-y-2">
		<h2><strong>{sectionLanguages()}</strong></h2>
		<ul class="ml-4 flex list-disc flex-col gap-1">
			{#each languages as lang}
				<li>
					<p>
						<strong>{lang.name()}:</strong>
						{lang.level()};
					</p>
				</li>
			{/each}
		</ul>
	</section>

	<section class="flex flex-col gap-y-2">
		<h2><strong>{sectionExperience()}</strong></h2>
		<ul class="flex flex-col gap-4 pl-4">
			{#each roles as role}
				<li class="flex flex-col gap-2">
					<div class="nobreak">
						<h3 class="inline"><strong>{role.name()}</strong></h3>
						|
						<p class="text-primary inline">
							{role.company()}
						</p>
						<p class="text-sm opacity-50">{role.date()}</p>
					</div>
					<ul class="ml-5 flex list-disc flex-col gap-2">
						{#each role.achievements as achievement}
							<li>
								<h4 class="inline"><strong>{achievement.name()}:</strong></h4>
								<p>{achievement.description()}</p>
							</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ul>
	</section>
</div>

<style>
	@media print {
		@page {
			background-color: var(--color-background) !important;
			print-color-adjust: exact !important;
			-webkit-print-color-adjust: exact !important;
			size: auto;
			margin: 1.5cm;
		}

		#wrapper {
			margin: 0;
			padding: 0;
		}

		li:not(:has(ul)),
		.nobreak {
			break-inside: avoid;
		}
	}
</style>
