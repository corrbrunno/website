<script>
	import { Github, Linkedin, Mail, MapPin, Phone } from '@lucide/svelte';

	const myInfo = [
		{ icon: MapPin, label: 'Saquarema / RJ' },
		{ icon: Phone, label: '22998131565' },
		{ icon: Linkedin, label: 'corrbrunno' },
		{ icon: Github, label: 'corrbrunno' },
		{ icon: Mail, label: 'correabruno43trabalho@gmail.com' }
	];

	const roles = [
		{
			name: 'Instrutor de Programação',
			company: 'Escola de Programação e Empreendedorismo de Saquarema ( EPES )',
			date: 'Dezembro 2025 - Atualmente',
			achievements: [
				{
					name: 'Estruturação e Planejamento',
					description:
						'Preparação de currículo e aulas focadas em Python, Scratch e lógica de programação, com escopo inicial planejado para capacitar cerca de 30 alunos.'
				},
				{
					name: 'Capacitação técnica e pedagógica',
					description:
						'Participação ativa em formações externas (UNASP) e intercâmbios internos de conhecimento, visando a padronização e excelência no ensino de tecnologia.'
				}
			]
		},
		{
			name: 'Desenvolvedor / Analista de Tecnologia',
			company: 'Subsecretaria de Ciência, Tecnologia e Inovação da Educação (SMECICT)',
			date: 'Setembro 2023',
			achievements: [
				{
					name: 'Liderou a transformação digital',
					description:
						'De processos administrativos da secretaria, desenvolvendo automações que substituíram 100% dos fluxos em papel, garantindo maior segurança, integração e rastreabilidade de dados.'
				},
				{
					name: 'Automatizou a criação e gestão de e-mails institucionais',
					description:
						'Para toda a rede escolar, eliminando um gargalo manual que mobilizava mais de 10 funcionários durante 3 dias inteiros (economia estimada de mais de 240 horas úteis por ciclo).'
				},
				{
					name: 'Desenvolveu a ferramenta interna "Templater" (JavaScript / Google Apps Script)',
					description:
						'Extensão criada para o Google Workspace que automatizou a geração de documentos a partir de dados em planilhas, padronizando arquivos e salvando-os organizadamente no Google Drive.'
				}
			]
		},
		{
			name: 'Suporte Tecnológico',
			company: 'Escola Municipal Edilênio da Silva de Souza',
			date: 'Agosto 2023',
			achievements: [
				{
					name: 'Auxílio à equipe escolar e estudantes',
					description:
						'Na adoção de novas tecnologias e desenvolvimento de automações iniciais para a criação de e-mails institucionais.'
				}
			]
		},
		{
			name: 'Desenvolvedor Backend Freelancer (Internacional / EUA)',
			company: 'Home Office',
			date: 'Janeiro 2021',
			achievements: [
				{
					name: 'Desenvolveu plugins personalizados em Java (Paper Spigot)',
					description:
						'Para um servidor estadunidense de temática futurista, suportando tráfego de aproximadamente 250 jogadores simultâneos.'
				},
				{
					name: 'Engenharia de mecânicas de jogo',
					description:
						'Criou sistemas complexos do zero, incluindo funcionalidades de jetpack (com sistema de permissões e dados persistentes), escudos e torretas funcionais integradas a estruturas de blocos.'
				},
				{
					name: 'Manutenção e otimização',
					description:
						'Atuou na refatoração e correção de bugs em plugins legados, garantindo a estabilidade do servidor e a fluidez do gameplay sob alta demanda.'
				}
			]
		}
	];
</script>

<div class="max-w-content-width mx-auto mt-10 flex flex-col gap-y-5 p-4">
	<section class="flex flex-col gap-y-2">
		<div>
			<p><strong>Bruno Corrêa dos Santos</strong></p>
			<p>Desenvolvedor Full Stack / Backend</p>
		</div>
		<ul class="ml-4 flex flex-wrap gap-x-4 gap-y-1">
			{#each myInfo as info}
				<li class="flex gap-2">
					<info.icon />
					<p>{info.label}</p>
				</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2><strong>Resumo Profissional</strong></h2>
		<p>
			Desenvolvedor de Software (Java, TypeScript, SvelteKit) focado em performance e automação.
			Experiência na criação de soluções backend para servidores internacionais (EUA) e na
			digitalização ponta a ponta de processos administrativos. Inglês avançado.
		</p>
	</section>

	<section class="flex flex-col gap-y-2">
		<h2><strong>Habilidades</strong></h2>
		<ul class="flex flex-col gap-1 pl-4">
			<li>
				<p>
					<strong>Linguagens:</strong>
					TypeScript, JavaScript, HTML, Java, CSS, Python, Rust;
				</p>
			</li>
			<li>
				<p>
					<strong>Frameworks & Tecnologias:</strong>
					SvelteKit, React, Node.js, Arduino;
				</p>
			</li>
			<li>
				<p>
					<strong>Banco de Dados:</strong>
					MySQL, PostgreSQL, SQLite;
				</p>
			</li>
			<li>
				<p>
					<strong>DevOps & Ferramentas:</strong>
					Docker, Docker-Compose, Git, Scrum, Kanban;
				</p>
			</li>
            <li>
				<p>
					<strong>Soft Skills:</strong>
					Resolução de Problemas, Raciocínio Lógico, Autonomia, Comunicação Técnica e Adaptabilidade;
				</p>
			</li>
		</ul>
	</section>

	<section class="flex flex-col gap-y-2">
		<h2><strong>Experiência Profissional</strong></h2>
		<ul class="flex flex-col gap-4 pl-4">
			{#each roles as role}
				<li class="flex flex-col gap-2">
					<div>
						<h3 class="inline"><strong>{role.name}</strong></h3>
						|
						<p class="text-primary inline">
							{role.company}
						</p>
						<p class="text-sm opacity-50">{role.date}</p>
					</div>
					<ul class="ml-5 flex list-disc flex-col gap-2">
						{#each role.achievements as achievement}
							<li>
								<h4 class="inline"><strong>{achievement.name}:</strong></h4>
								<p>
									{achievement.description}
								</p>
							</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ul>
	</section>
</div>
