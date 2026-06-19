export type RevealOptions = {
	threshold?: number;
	rootMargin?: string;
	stagger?: number;
	once?: boolean;
	direction?: 'up' | 'down' | 'left' | 'right';
	duration?: number;
	delay?: number;
};

export type SeqOptions = Omit<RevealOptions, 'delay'> & { delay?: number; gap?: number };

function isVtActive(): boolean {
	return document.body.dataset.vtActive === 'true';
}

export function reveal(node: HTMLElement, options: RevealOptions = {}) {
	const {
		threshold = 0.15,
		rootMargin = '0px 0px -50px 0px',
		stagger = 0,
		once = true,
		direction = 'up',
		duration = 600,
		delay = 0,
	} = options;

	node.style.setProperty('--reveal-duration', `${duration}ms`);
	node.style.setProperty('--reveal-delay', `${delay + stagger}ms`);
	node.classList.add('reveal', `reveal-${direction}`);

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				if (once && isVtActive()) {
					setTimeout(() => {
						node.classList.add('revealed');
						observer.unobserve(node);
					}, 500);
				} else {
					node.classList.add('revealed');
					if (once) observer.unobserve(node);
				}
			} else if (!once) {
				node.classList.remove('revealed');
			}
		},
		{ threshold, rootMargin }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.unobserve(node);
		}
	};
}

/** Gera uma sequÃªncia de opÃ§Ãµes com delay escalonado.
 *
 * @example
 * ```svelte
 * <script>
 *   import { reveal, seq } from '$lib/client/animations/reveal';
 *   const [h1, p, img] = seq(3, { direction: 'up' });
 * </script>
 *
 * <h1 use:reveal={h1}>Title</h1>
 * <p use:reveal={p}>Text</p>
 * <img use:reveal={img} />
 * ```
 */
export function seq(count: number, opts: SeqOptions = {}): RevealOptions[] {
	const { gap = 80, delay = 0, ...rest } = opts;
	return Array.from({ length: count }, (_, i) => ({
		...rest,
		delay: delay + i * gap,
	}));
}
