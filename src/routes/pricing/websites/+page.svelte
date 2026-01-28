<script>
    import {
        Book,
        CalendarClock,
        Car,
        Clock4,
        Gem,
        Repeat,
        Rocket,
        Settings,
    } from '@lucide/svelte';
    import PricingLayoult from '../pricing-layoult.svelte';
    import * as m from '$lib/paraglide/messages';

    const faqData = [
        {
            question: m.websites_faq_q1,
            answer: m.websites_faq_a1
        },
        {
            question: m.websites_faq_q2,
            answer: m.websites_faq_a2
        },
        {
            question: m.websites_faq_q3,
            answer: m.websites_faq_a3
        },
        {
            question: m.websites_faq_q4,
            answer: m.websites_faq_a4
        },
        {
            question: m.websites_faq_q5,
            answer: m.websites_faq_a5
        },
        {
            question: m.websites_faq_q6,
            answer: m.websites_faq_a6
        }
    ];

    const keyPointsData = [
        {
            header: m.websites_point_person_header,
            description: m.websites_point_person_desc
        },
        {
            header: m.websites_point_center_header,
            description: m.websites_point_center_desc
        },
        {
            header: m.websites_point_cred_header,
            description: m.websites_point_cred_desc
        },
        {
            header: m.websites_point_avail_header,
            description: m.websites_point_avail_desc
        }
    ];

    const keyFeaturesData = [
        {
            header: m.websites_feature_design_header,
            description: m.websites_feature_design_desc,
            icon: Gem
        },
        {
            header: m.websites_feature_code_header,
            description: m.websites_feature_code_desc,
            icon: Rocket
        },
        {
            header: m.websites_feature_config_header,
            description: m.websites_feature_config_desc,
            icon: Settings
        },
        {
            header: m.websites_feature_scale_header,
            description: m.websites_feature_scale_desc,
            icon: CalendarClock
        }
    ];

    const pricingCardsData = [
        {
            price: 1200,
            paymentFrequency: m.websites_card_ess_freq,
            title: m.websites_card_ess_title,
            actionButton: { name: m.websites_btn_start, link: 'test' },
            featureItems: [
                { feature: m.websites_feat_home, icon: Clock4 },
                { feature: m.websites_feat_static, icon: Car },
                { feature: m.websites_feat_contact_btn, icon: Gem },
                { feature: m.websites_feat_responsive, icon: Settings },
                { feature: m.websites_feat_speed, icon: Rocket }
            ]
        },
        {
            price: 2500,
            paymentFrequency: m.websites_card_adv_freq,
            title: m.websites_card_adv_title,
            actionButton: { name: m.websites_btn_start, link: 'test' },
            featureItems: [
                { feature: m.websites_feat_all_ess, icon: Repeat },
                { feature: m.websites_feat_multi, icon: Clock4 },
                { feature: m.websites_feat_seo, icon: Car },
                { feature: m.websites_feat_blog, icon: Gem }
            ]
        },
        {
            price: 6000,
            paymentFrequency: m.websites_card_cust_freq,
            title: m.websites_card_cust_title,
            actionButton: { name: m.websites_btn_contact, link: 'test' },
            featureItems: [
                { feature: m.websites_feat_all_adv, icon: Rocket },
                { feature: m.websites_feat_logic, icon: Settings },
                { feature: m.websites_feat_lang, icon: Book },
                { feature: m.websites_feat_integ, icon: Repeat }
            ]
        }
    ];
</script>

<PricingLayoult
    keyPointsTitle={m.websites_key_points_title()}
    {keyPointsData}
    {keyFeaturesData}
    pricingSubtitle={m.websites_pricing_subtitle()}
    {pricingCardsData}
    faqContentData={faqData}
>
    {#snippet heading()}
        {m.websites_hero_start()} <span class="text-primary">{m.websites_hero_high_1()}</span>{m.websites_hero_mid()}
        <span class="text-primary">{m.websites_hero_high_2()}</span>{m.websites_hero_end()}
    {/snippet}

    {#snippet pricingTitle()}
        {m.websites_pricing_title()} <span class="text-primary">{m.websites_pricing_highlight()}</span>.
    {/snippet}
</PricingLayoult>