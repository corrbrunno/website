<script>
	import { Book, CalendarCheck, Car, Clock4, Gem, HousePlugIcon, Repeat, Rocket, Users } from '@lucide/svelte';
	import FeatureGrid from '../feature-grid.svelte';
	import PricingCard from '../pricing-card.svelte';
	import Faq from '../faq.svelte';
</script>

<h1 class="mx-auto max-w-130 pt-10 text-center text-3xl font-bold">
	Deixe de ser apenas consumidor e <span class="text-primary">torne-se um criador do futuro</span>.
</h1>

<div class=" pt-10">
	<p class="p-5 text-center text-lg font-bold">O que vai dominar?</p>
	<FeatureGrid
		items={[
			{
				header: 'Produtividade',
				description:
					'Aumente sua produtividade com pensamento computacional, identifique processos que podem ser otimizados ou completamente automatizados e faça a diferença onde estiver.'
			},
			{
				header: 'Desenvolvimento Web',
				description:
					'Crie websites interativos e responsivos completamente do zero. Entenda toda a estrutura, código, planejamento e passos precisos para desenvolver uma página web.'
			},
			{
				header: 'Análise e Tratamento de Dados',
				description:
					'Dados são a fonte do conhecimento. Entenda como podemos organiza-los de forma que fique clara e objetiva a busca e inserção, além de aprender a extrair informações valiosas para seu negócio ou carreira.'
			},
			{
				header: 'Desenvolvimento Backend',
				description:
					'Entenda como os aplicativos e jogos são feitos, desbloqueie o poder de criar o que precisa ou idealiza, tirando idéias do papel, com suas próprias mãos.'
			}
		]}
	></FeatureGrid>
</div>

<div class="bg-primary/30 mt-10 p-7">
	<p class="pb-5 text-center text-lg font-bold">Diferenciais</p>
	<FeatureGrid
		items={[
			{
				header: 'Produtividade',
				description:
					'Seus objetivos e modo de aprendizado são considerados em cada plano de aula. Desta forma, terá o melhor proveito de seu tempo.',
				icon: Gem
			},
			{
				header: 'Do Básico ao Avançado',
				description:
					'O ritmo da aula é personalizado, a aula segue  seu ritmo de aprendizado e parte exatamente de seu nível atual.',
				icon: Book
			},
			{
				header: 'Feedback Imediato',
				description:
					'Não será preciso ficar horas buscando a solução para um erro, será guiado até a solução de forma que entenda o motivo do erro.',
				icon: Repeat
			},
			{
				header: 'Projetos Customizados',
				description:
					'Aprenda criando algo de seu real interesse, sem projetos genêricos, será focado em seus objetivos e gostos pessoais.',
				icon: Rocket
			}
		]}
	></FeatureGrid>
</div>

<div class="text-center px-4">
	<div class="mb-10">
		<h1 class="pt-10 text-3xl font-bold">
			Descubra o seu <span class="text-primary">potêncial</span>.
		</h1>
		<p class="pt-2 text-muted-foreground">
			A tecnologia está presente em todas as áreas, faça parte do futuro.
		</p>
	</div>
	<section class="flex items-center justify-start md:justify-center gap-4 pb-2 overflow-x-scroll">
	<PricingCard
		price={150}
		paymentFrequency="Aula"
		title={'Particular (presencial)'}
		actionButton={{ name: 'Começar agora', link: 'test' }}
		featureItems={[
			{ feature: 'Plano de aula exclusivo', icon: Gem },
			{ feature: 'Uma hora de aula', icon: Clock4 },
			{ feature: 'Ida in loco', icon: Car },
			{ feature: 'Do básico à avançado', icon: Book },
		]}
	></PricingCard>
		<PricingCard
		price={250}
		paymentFrequency="2 Aulas"
		title={'Particular (remoto)'}
		actionButton={{ name: 'Começar agora', link: 'test' }}
		featureItems={[
			{ feature: 'Plano de aula exclusivo', icon: Gem },
			{ feature: 'Uma hora de aula', icon: Clock4 },
			{ feature: 'Duas aulas por semana', icon: CalendarCheck },
			{ feature: 'Do básico à avançado', icon: Book },
		]}
	></PricingCard>
			<PricingCard
		price={100}
		paymentFrequency="Aula"
		title={'Grupo (remoto)'}
		actionButton={{ name: 'Começar agora', link: 'test' }}
		featureItems={[
			{ feature: 'Networking', icon: Users },
			{ feature: 'Uma hora de aula', icon: Clock4 },
			{ feature: 'Duas aulas por semana', icon: CalendarCheck },
			{ feature: 'Do básico à avançado', icon: Book },
		]}
	></PricingCard>
	</section>
</div>

<div class="max-w-content-width mx-auto my-10 w-full items-center px-4">
	<Faq faqData={[
		{ question: 'É preciso conhecimento prévio?', answer: 'Não é preciso, as aulas partem de seu conhecimento atual, seja ele básico ou avançado.' },
		{ question: 'Qual seria a disponibilidade de horários?', answer: 'Para as modalidades particular, o horário é acordado previamente, alinhando sua disponibilidade e preferência, com a minha disponibilidade.' },
		{ question: 'Presencialmente, tem taxa de deslocamento?', answer: 'Não há taxas! Entretanto, cobrimos apenas o município de saquarema.' }
		]}></Faq>
</div>
