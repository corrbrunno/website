<script lang="ts">
	import * as Accordion from "$lib/components/ui/accordion";
    import * as Card from "$lib/components/ui/card";
	import type { LocalizedString } from "@inlang/paraglide-js";
    export type faqData = {question: () => LocalizedString, answer: () => LocalizedString}[];
    const {content } : {content : faqData} = $props();
</script>

<Card.Root>
    <Card.Header class="text-center font-bold">
        <h2>FAQ</h2>
    </Card.Header>
    <Card.Content class="max-w-content-width mx-auto grid w-full grid-cols-1  gap-y-4  gap-x-10 px-10 md:grid-cols-2">
        {#each content as { question, answer}}
        <Accordion.Root type="single">
            <Accordion.Item>
                <Accordion.Trigger>{question()}</Accordion.Trigger>
                <Accordion.Content><p>{answer()}</p></Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
            
        {/each}
    </Card.Content>
</Card.Root>