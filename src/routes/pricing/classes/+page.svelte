<script>
	import {
		Book,
		Gem,
		HousePlugIcon,
		Repeat,
		Rocket
	} from '@lucide/svelte';
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

<div class="flex flex-col items-center">
	<div class="mb-10">
	<h1 class="pt-10 text-center text-3xl font-bold">
		Descubra o seu <span class="text-primary">potêncial</span>.
	</h1>
	<p class="text-muted-foreground">
		A tecnologia está presente em todas as áreas, faça parte do futuro.
	</p>
	</div>
	<PricingCard
		price={250}
		paymentFrequency="Aula"
		title={'Particular (remoto)'}
		actionButton={{ name: 'Agora!', link: 'test' }}
		featureItems={[{ feature: 'easy', icon: HousePlugIcon }]}
	></PricingCard>
</div>

<div class="max-w-content-width my-10 px-4 w-full items-center mx-auto">
	<Faq faqData={[{ question: 'does this works?', answer: 'sure it does, just look at it!' }]}></Faq>
	
</div>