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

const faqData = [
        {
            question: 'Quanto tempo leva para o site ficar pronto?',
            answer:
                'O prazo varia conforme o plano: o Essencial costuma ser entregue em até 30 dias úteis, enquanto projetos Customizados dependem da complexidade das funcionalidades escolhidas.'
        },
        {
            question: 'Eu serei o dono do meu site?',
            answer:
                'Sim! Diferente de plataformas de aluguel, o código e o domínio são seus. Você terá total autonomia e propriedade sobre o projeto final.'
        },
        {
            question: 'O que é o domínio e a hospedagem?',
            answer:
                'O domínio é o seu endereço na web (ex: www.suaempresa.com.br) e a hospedagem é onde os arquivos do site ficam guardados. Eu auxilio em toda a configuração técnica desses serviços.'
        },
        {
            question: 'Meu site vai aparecer no Google?',
            answer:
                'Sim. Todos os planos incluem otimização básica de SEO para que seu site seja indexado. Nos planos Avançado e Customizado, aplicamos estratégias mais profundas para melhorar seu posicionamento nas buscas.'
        },
        {
            question: 'O site funciona bem no celular?',
            answer:
                'Com certeza. Desenvolvo sites com design responsivo, o que significa que eles se adaptam perfeitamente a qualquer tela, seja computador, tablet ou smartphone.'
        },
        {
            question: 'E se eu precisar de alterações no futuro?',
            answer:
                'No plano Customizado, você recebe um treinamento para gerir seu próprio conteúdo. Além disso, ofereço suporte para atualizações e novas funcionalidades sob demanda.'
        }
    ];

	const keyPointsData = [
		{
			header: 'Personalidade',
			description:
				'Sua marca, suas regras. Diferente das redes sociais, um website permite transmitir a essência real do seu trabalho através de um design exclusivo — seja ele minimalista ou artístico — criando uma conexão visual imediata e única com seu cliente.'
		},
		{
			header: 'Centralizador',
			description:
				'O coração da sua presença digital. Reúna todo o seu conteúdo, serviços e contatos em um só lugar. O website atua como a âncora estratégica das suas redes sociais, servindo como o guia definitivo que conduz o seu público.'
		},
		{
			header: 'Credibilidade',
			description:
				'Autoridade que gera confiança. No mercado digital, um domínio próprio é o maior sinal de profissionalismo. Ele valida seu conteúdo, protege sua imagem contra instabilidades de plataformas de terceiros e garante que sua marca seja levada a sério.'
		},
		{
			header: 'Disponibilidade',
			description:
				'Sua vitrine aberta para o mundo. Esteja presente onde as buscas acontecem. Um site bem estruturado garante que sua marca seja encontrada por novos clientes 24 horas por dia, funcionando como uma apresentação profissional que nunca dorme.'
		}
	];

	const keyFeaturesData = [
		{
			header: 'Design Estratégico',
			description:
				'Não é apenas um site bonito. Desenvolvemos uma interface focada em conversão, onde cada botão e seção é posicionado para guiar o seu cliente até a tomada de decisão.',
			icon: Gem
		},
		{
			header: 'Código de Alta Performance',
			description:
				'Sites feitos sob medida são leves e rápidos. Isso garante que seu cliente não desista da compra por demora no carregamento e melhora seu posicionamento no Google.',
			icon: Rocket
		},
		{
			header: 'Configuração Completa',
			description:
				'Cuidamos de toda a parte técnica: desde o registro do seu domínio profissional até a configuração de servidores e hospedagem de alta segurança.',
			icon: Settings
		},
		{
			header: 'Escalabilidade',
			description:
				'Diferente de plataformas limitadas, seu site pode crescer junto com seu negócio, permitindo adicionar novas funções e ferramentas personalizadas no futuro.',
			icon: CalendarClock
		}
	];

	const pricingCardsData = [
		{
			price: 1200,
			paymentFrequency: 'Varia até R$ 1.800',
			title: 'Essencial',
			actionButton: { name: 'Começar agora', link: 'test' },
			featureItems: [
				{ feature: 'Página de início', icon: Clock4 },
				{ feature: 'Conteúdo Estático', icon: Car },
				{ feature: 'Botão de contato(s)', icon: Gem },
				{ feature: 'Design Responsivo', icon: Settings },
				{ feature: 'Otimização Velocidade', icon: Rocket }
			]
		},
		{
			price: 2500,
			paymentFrequency: 'Varia até R$ 4.500',
			title: 'Avançado',
			actionButton: { name: 'Começar agora', link: 'test' },
			featureItems: [
				{ feature: 'Tudo do essêncial, mais:', icon: Repeat },
				{ feature: 'Multiplas páginas', icon: Clock4 },
				{ feature: 'Otimização para Google', icon: Car },
				{ feature: 'Blog / Galeria', icon: Gem }
			]
		},
		{
			price: 6000,
			paymentFrequency: 'Varia conforme o projeto',
			title: 'Customizado',
			actionButton: { name: 'Entrar em Contato', link: 'test' },
			featureItems: [
				{ feature: 'Tudo do avançado, mais:', icon: Rocket },
				{ feature: 'Sistemas e Lógica Complexa', icon: Settings },
				{ feature: 'Multilinguagem (PT/EN)', icon: Book },
				{ feature: 'Integração com outros sistemas', icon: Repeat }
			]
		}
	];
</script>

<PricingLayoult
	keyPointsTitle="Porquê um website?"
	{keyPointsData}
	{keyFeaturesData}
	pricingSubtitle="Não tenha sua base em outras plataformas, crie sua própria, sólida."
	{pricingCardsData}
	faqContentData={faqData}
>
	{#snippet heading()}
		Tenha <span class="text-primary">visibilidade digital</span>, com uma página que é
		<span class="text-primary">realmente sua</span>.
	{/snippet}
	{#snippet pricingTitle()}
		Esteja presente <span class="text-primary">digitalmente</span>.
	{/snippet}
</PricingLayoult>
