<script lang="ts">
    import { cn } from '$lib/utils';
    import type { HTMLInputAttributes } from 'svelte/elements';

    const {
        class: classNames,
        options,
        itemWidth = 100,
        itemsGap = 10,
        speedPxPerSecond = 100,
        ...other
    }: {
        class?: string;
        itemWidth?: number;
        itemsGap?: number;
        speedPxPerSecond?: number;
        options: string[];
        other?: HTMLInputAttributes;
    } = $props();

    let innerWidth = $state(0);
    const itemTotalWidth = $derived(itemWidth + itemsGap);
    const totalItems = $derived(Math.ceil(innerWidth / itemTotalWidth));
    
    const totalListWidth = $derived(
        options.length * itemTotalWidth * totalItems 
    );
    const calculatedDuration = $derived(totalListWidth / speedPxPerSecond);

    const repeatedTexts = $derived(
        Array.from({ length: Math.ceil(totalItems / options.length) * options.length  }, (_, i) => options[i % options.length])
    );

</script>

<svelte:window bind:innerWidth={innerWidth} />

<section
    class={cn(classNames, 'carousel w-full')}
    style:--gap={`${itemsGap}px`}
    style:--item-width={`${itemWidth}px`}
    style:--animation-duration={`${calculatedDuration}s`}
    {...other}
>
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
</section>

<style>
    .carousel {
        position: relative;
        overflow: hidden;
        
        padding-block: 0.5rem;
        user-select: none;

        -webkit-mask-image: linear-gradient(to right, transparent, black 50%, black 50%, transparent);
        mask-image: linear-gradient(to right, transparent, black 50%, black 50%, transparent);
    }

    .scrolling-content {
        gap: var(--gap);
        display: flex;
    }

    .carousel ul {
        display: flex;
        gap: var(--gap);

        animation: scroll var(--animation-duration) linear infinite;
    }

    .carousel li {
        width: var(--item-width);
        text-align: center;
        font-size: var(--text-2xl);
        font-weight: bold;
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