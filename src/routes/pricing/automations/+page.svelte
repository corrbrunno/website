<script>
	import {
		Activity,
		Book,
		Bot,
		ChartColumnIncreasing,
		FileDigit,
		FileSpreadsheet,
		House,
		Lightbulb,
		PlugZap,
		Repeat,
		Smartphone,
		Users,
		Zap
	} from '@lucide/svelte';
	import PricingLayoult from '../pricing-layoult.svelte';
	import * as m from '$lib/paraglide/messages';

const faqData = [
    {
        question: m.automation_faq_q1,
        answer: m.automation_faq_a1,
    },
    {
        question: m.automation_faq_q2,
        answer: m.automation_faq_a2
    },
    {
        question: m.automation_faq_q3,
        answer: m.automation_faq_a3
    },
    {
        question: m.automation_faq_q4,
        answer: m.automation_faq_a4
    },
    {
        question: m.automation_faq_q5,
        answer: m.automation_faq_a5
    }
];

const keyPointsData = [
    {
        header: m.automation_point_errors_header,
        description: m.automation_point_errors_description
    },
    {
        header: m.automation_point_sheets_header,
        description: m.automation_point_sheets_description
    },
    {
        header: m.automation_point_integration_header,
        description: m.automation_point_integration_description
    },
    {
        header: m.automation_point_time_header,
        description: m.automation_point_time_description
    }
];

const keyFeaturesData = [
    {
        header: m.automation_feature_files_header,
        description: m.automation_feature_files_description,
        icon: FileDigit
    },
    {
        header: m.automation_feature_rpa_header,
        description: m.automation_feature_rpa_description,
        icon: Bot
    },
    {
        header: m.automation_feature_dashboards_header,
        description: m.automation_feature_dashboards_description,
        icon: ChartColumnIncreasing
    },
    {
        header: m.automation_feature_iot_header,
        description: m.automation_feature_iot_description,
        icon: Activity
    }
];

const pricingCardsData = [
    {
        price: 450,
        paymentFrequency: m.automation_price_freq_task,
        title: m.automation_price_pontual_title,
        actionButton: { name: m.automation_price_pontual_btn, link: 'test' },
        featureItems: [
            { feature: m.automation_price_pontual_f1, icon: FileDigit },
            { feature: m.automation_price_pontual_f2, icon: Repeat },
            { feature: m.automation_price_pontual_f3, icon: Zap },
            { feature: m.automation_price_pontual_f4, icon: Book }
        ]
    },
    {
        price: 950,
        paymentFrequency: m.automation_price_freq_consult,
        title: m.automation_price_comercial_title,
        actionButton: { name: m.automation_price_comercial_btn, link: 'test' },
        featureItems: [
            { feature: m.automation_price_comercial_f1, icon: Repeat },
            { feature: m.automation_price_comercial_f2, icon: ChartColumnIncreasing },
            { feature: m.automation_price_comercial_f3, icon: FileSpreadsheet },
            { feature: m.automation_price_comercial_f4, icon: Bot },
            { feature: m.automation_price_comercial_f5, icon: Users }
        ]
    },
    {
        price: 340,
        paymentFrequency: m.automation_price_freq_consult,
        title: m.automation_price_iot_title,
        actionButton: { name: m.automation_price_iot_btn, link: 'test' },
        featureItems: [
            { feature: m.automation_price_iot_f1, icon: Activity },
            { feature: m.automation_price_iot_f2, icon: Lightbulb },
            { feature: m.automation_price_iot_f3, icon: PlugZap },
            { feature: m.automation_price_iot_f4, icon: Smartphone },
            { feature: m.automation_price_iot_f5, icon: House }
        ]
    }
];
</script>

<PricingLayoult
	keyPointsTitle={m.automation_key_points_title()}
	{keyPointsData}
	{keyFeaturesData}
	pricingSubtitle={m.automation_pricing_subtitle()}
	{pricingCardsData}
	faqContentData={faqData}
>
	{#snippet heading()}
			{m.automation_hero_title_start()}
			<span class="text-primary">{m.automation_hero_highlight()}</span>
			{m.automation_hero_title_end()}
	{/snippet}

	{#snippet pricingTitle()}
			{m.automation_pricing_title()} <span class="text-primary">{m.automation_pricing_highlight()}</span>.
	{/snippet}
</PricingLayoult>
