<script lang="ts">
    import { cn } from '$lib/utils';
    import type { HTMLInputAttributes } from 'svelte/elements';

    const {
        class: classNames,
        options,
        itemWidth = 100,
        itemsGap = 10,
        animationDuration = 120,
        ...other
    }: {
        class?: string;
        itemWidth?: number;
        itemsGap?: number;
        animationDuration?: number;
        options: string[];
        other?: HTMLInputAttributes;
    } = $props();

    const itemTotalWidth = itemWidth + itemsGap;
    
    let innerWidth = $state(0);
    let itemsPerLoop = $derived(Math.ceil(innerWidth / itemTotalWidth) + 2);

    let repeatedTexts = $derived(
        Array.from({ length: itemsPerLoop * options.length }, (_, i) => options[i % options.length])
    );
</script>

<svelte:body bind:clientWidth={innerWidth} />

<section
    class={cn(classNames, 'carousel w-full')}
    style:--gap={`${itemsGap}px`}
    style:--item-width={`${itemWidth}px`}
    style:--animation-duration={`${animationDuration}s`}
    {...other}
>
    <div class="scrolling-content-wrapper">
        <div class="scrolling-content">
            <ul>
                {#each repeatedTexts as text}
                    <li>{text}</li>
                {/each}
            </ul>
            <ul aria-hidden="true">
                {#each repeatedTexts as text}
                    <li>{text}</li>
                {/each}
            </ul>
        </div>
    </div>
</section>

<style>
    .carousel {
        position: relative;
        overflow: hidden;
        
        padding-block: 0.5rem;
        user-select: none;

        -webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
        mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
    }

    .scrolling-content-wrapper {
        bottom: 0;
        left: 0;
        top: 0;
    }

    .scrolling-content {
        align-items: center; 
        gap: var(--gap);
        display: flex;
        height: 100%;
    }

    .carousel ul {
        list-style: none;
        display: flex;
        flex-shrink: 0;
        gap: var(--gap);
        
        animation: scroll var(--animation-duration) linear infinite;
    }

    .carousel:hover ul {
        animation-play-state: paused;
    }

    .carousel li {
        flex: 0 0 var(--item-width);
        text-align: center;
        font-size: clamp(1rem, 2vw, 1.5rem);
        font-weight: 600;
        white-space: nowrap;
    }

    @keyframes scroll {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(calc(-100% - var(--gap)));
        }
    }
</style>