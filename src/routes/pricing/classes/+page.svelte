<script>
    import { Book, CalendarCheck, Car, Clock4, Gem, Repeat, Rocket, Users } from '@lucide/svelte';
    import PricingLayoult from '../pricing-layoult.svelte';
    import * as m from '$lib/paraglide/messages';

    const faqData = [
        {
            question: m.classes_faq_q1,
            answer: m.classes_faq_a1
        },
        {
            question: m.classes_faq_q2,
            answer: m.classes_faq_a2
        },
        {
            question: m.classes_faq_q3,
            answer: m.classes_faq_a3
        }
    ];

    const keyPointsData = [
        {
            header: m.classes_point_prod_header,
            description: m.classes_point_prod_desc
        },
        {
            header: m.classes_point_web_header,
            description: m.classes_point_web_desc
        },
        {
            header: m.classes_point_data_header,
            description: m.classes_point_data_desc
        },
        {
            header: m.classes_point_back_header,
            description: m.classes_point_back_desc
        }
    ];

    const keyFeaturesData = [
        {
            header: m.classes_feature_prod_header,
            description: m.classes_feature_prod_desc,
            icon: Gem
        },
        {
            header: m.classes_feature_basic_header,
            description: m.classes_feature_basic_desc,
            icon: Book
        },
        {
            header: m.classes_feature_feedback_header,
            description: m.classes_feature_feedback_desc,
            icon: Repeat
        },
        {
            header: m.classes_feature_custom_header,
            description: m.classes_feature_custom_desc,
            icon: Rocket
        }
    ];

    const pricingCardsData = [
        {
            price: 150,
            paymentFrequency: m.classes_price_freq_1,
            title: m.classes_card_private_pres_title,
            actionButton: { name: m.classes_price_btn_start, link: 'test' },
            featureItems: [
                { feature: m.classes_price_feat_plan, icon: Gem },
                { feature: m.classes_price_feat_1h, icon: Clock4 },
                { feature: m.classes_price_feat_loco, icon: Car },
                { feature: m.classes_price_feat_basic_adv, icon: Book }
            ]
        },
        {
            price: 250,
            paymentFrequency: m.classes_price_freq_2,
            title: m.classes_card_private_rem_title,
            actionButton: { name: m.classes_price_btn_start, link: 'test' },
            featureItems: [
                { feature: m.classes_price_feat_plan, icon: Gem },
                { feature: m.classes_price_feat_1h, icon: Clock4 },
                { feature: m.classes_price_feat_2wk, icon: CalendarCheck },
                { feature: m.classes_price_feat_basic_adv, icon: Book }
            ]
        },
        {
            price: 100,
            paymentFrequency: m.classes_price_freq_1,
            title: m.classes_card_group_rem_title,
            actionButton: { name: m.classes_price_btn_start, link: 'test' },
            featureItems: [
                { feature: m.classes_price_feat_network, icon: Users },
                { feature: m.classes_price_feat_1h, icon: Clock4 },
                { feature: m.classes_price_feat_2wk, icon: CalendarCheck },
                { feature: m.classes_price_feat_basic_adv, icon: Book }
            ]
        }
    ];
</script>

<PricingLayoult
    keyPointsTitle={m.classes_key_points_title()}
    {keyPointsData}
    {keyFeaturesData}
    pricingSubtitle={m.classes_pricing_subtitle()}
    {pricingCardsData}
    faqContentData={faqData}
>
    {#snippet heading()}
        {m.classes_hero_title_start()} <span class="text-primary">{m.classes_hero_highlight()}</span>{m.classes_hero_title_end()}
    {/snippet}

    {#snippet pricingTitle()}
        {m.classes_pricing_title()} <span class="text-primary">{m.classes_pricing_highlight()}</span>.
    {/snippet}
</PricingLayoult>