<script>
	import {
		Book,
		CalendarCheck,
		Car,
		Clock4,
		Gem,
		Repeat,
		Rocket,
		Settings,
		Zap,
		Database,
		FileSpreadsheet,
		Cpu,
		Users,
		FileDigit,
		ChartColumnIncreasing,
		Bot,
		Activity,
		Lightbulb,
		Smartphone,
		House,
		PlugZap
	} from '@lucide/svelte';
	import PricingLayoult from '../pricing-layoult.svelte';

	const faqData = [
		{
			question: 'Como recebo e uso as automações pontuais?',
			answer:
				'Eu entrego um arquivo executável ou um script simples. Você só precisará dar dois cliques para ele realizar a tarefa (como organizar arquivos ou converter dados) instantaneamente no seu computador.'
		},
		{
			question: 'Preciso comprar dispositivos caros para o plano IOT?',
			answer:
				'Não necessariamente. Eu utilizo componentes de excelente custo-benefício (como ESP32). Eu te envio a lista do que comprar ou já entrego o dispositivo pronto e configurado para sua casa ou comércio.'
		},
		{
			question: 'O que acontece se o site ou sistema que eu uso mudar?',
			answer:
				'Automações de navegador (RPA) podem precisar de ajustes se o site mudar drasticamente. Por isso, ofereço um período de suporte e auxílio na utilização para garantir que tudo continue rodando perfeitamente.'
		},
		{
			question: 'Minhas informações e senhas estarão seguras?',
			answer:
				'Totalmente. No plano Pontual e Comercial, os scripts rodam localmente na sua máquina. Seus dados e senhas não passam pelo meu servidor; o código pertence a você e funciona de forma privada.'
		},
		{
			question: 'Posso controlar as luzes e tomadas mesmo estando fora de casa?',
			answer:
				'Sim! No plano IOT, configuramos um aplicativo ou interface simples no seu celular para que você tenha controle total dos seus dispositivos de qualquer lugar com acesso à internet.'
		}
	];

	const keyPointsData = [
		{
			header: 'Eliminação de Erros',
			description:
				'Erros manuais custam caro. Com automações e scripts validados, você garante que seus dados e relatórios estejam sempre 100% precisos, sem falhas humanas.'
		},
		{
			header: 'Planilhas Inteligentes',
			description:
				'Vá além das fórmulas básicas. Transforme suas planilhas de Excel ou Google Sheets em sistemas robustos que processam dados e geram insights automaticamente.'
		},
		{
			header: 'Integração de Sistemas',
			description:
				'Faça suas ferramentas conversarem. Conecte seu CRM, e-mail e planilhas para que as informações fluam sem que você precise copiar e colar nada.'
		},
		{
			header: 'Recupere seu Tempo',
			description:
				'Tarefas repetitivas drenam sua energia. Automatize processos que levam horas e execute-os em segundos, focando no que realmente traz lucro para o seu negócio.'
		}
	];

	const keyFeaturesData = [
		{
			header: 'Manipulação de Arquivos',
			description:
				'Scripts para renomear, converter e organizar grandes volumes de arquivos ou fotos em segundos, eliminando o trabalho manual no PC.',
			icon: FileDigit
		},
		{
			header: 'Robôs de Navegação (RPA)',
			description:
				'Automações que acessam sites, preenchem formulários e coletam dados automaticamente, simulando o comportamento humano sem erros.',
			icon: Bot
		},
		{
			header: 'Dashboards e Relatórios',
			description:
				'Transformação de dados brutos de planilhas ou sistemas em painéis visuais automáticos para facilitar sua tomada de decisão.',
			icon: ChartColumnIncreasing
		},
		{
			header: 'Ecossistema IOT',
			description:
				'Integração de sensores, lâmpadas e dispositivos inteligentes controlados por código personalizado e acessíveis pelo seu smartphone.',
			icon: Activity
		}
	];

	const pricingCardsData = [
		{
			price: 450,
			paymentFrequency: 'Por Script / Tarefa',
			title: 'Pontual',
			actionButton: { name: 'Resolver tarefa', link: 'test' },
			featureItems: [
				{ feature: 'Automação de arquivos (Renomear/Mover)', icon: FileDigit },
				{ feature: 'Conversão de dados (PDF/Excel)', icon: Repeat },
				{ feature: 'Scripts de tarefa única no PC', icon: Zap },
				{ feature: 'Auxilio na utilização', icon: Book }
			]
		},
		{
			price: 950,
			paymentFrequency: 'Sob Consulta',
			title: 'Comercial',
			actionButton: { name: 'Automatizar agora', link: 'test' },
			featureItems: [
				{ feature: 'Integração entre 3 apps', icon: Repeat },
				{ feature: 'Dashboard de indicadores', icon: ChartColumnIncreasing },
				{ feature: 'Planilha Automatizada', icon: FileSpreadsheet },
				{ feature: 'Automação de Navegador (RPA)', icon: Bot },
				{ feature: 'Treinamento de equipe', icon: Users }
			]
		},
		{
			price: 340,
			paymentFrequency: 'Sob Consulta',
			title: 'IOT',
			actionButton: { name: 'Consultar projeto', link: 'test' },
			featureItems: [
				{ feature: 'Configuração de sensores', icon: Activity },
				{ feature: 'Automação de Lâmpadas', icon: Lightbulb },
				{ feature: 'Automação de Tomadas', icon: PlugZap },
				{ feature: 'Aplicativo Pessoal', icon: Smartphone },
				{ feature: 'Automações Residenciais', icon: House }
			]
		}
	];
</script>

<PricingLayoult
	keyPointsTitle="Por que automatizar?"
	{keyPointsData}
	{keyFeaturesData}
	pricingSubtitle="Pare de lutar com tarefas repetitivas e deixe a tecnologia trabalhar por você."
	{pricingCardsData}
	faqContentData={faqData}
>
	{#snippet heading()}
		<span class="text-balance">
			Recupere seu tempo e <span class="text-primary">elimine o trabalho manual</span> com soluções de
			automação inteligente.
		</span>
	{/snippet}

	{#snippet pricingTitle()}
		<span class="text-balance">
			Invista em <span class="text-primary">eficiência</span>.
		</span>
	{/snippet}
</PricingLayoult>
