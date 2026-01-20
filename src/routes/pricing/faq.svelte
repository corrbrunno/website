<script lang="ts">
	import * as Accordion from "$lib/components/ui/accordion";
    const {faqData } : {faqData : {question: string, answer:string}[]} = $props();
    import * as Card from "$lib/components/ui/card";
</script>

<Card.Root>
    <Card.Header class="text-center font-bold">
        <h2>FAQ</h2>
    </Card.Header>
    <Card.Content class="max-w-content-width mx-auto grid w-full grid-cols-1 gap-10 px-10 md:grid-cols-2">
        {#each faqData as { question, answer}}
        <Accordion.Root type="single">
            <Accordion.Item>
                <Accordion.Trigger>{question}</Accordion.Trigger>
                <Accordion.Content><p>{answer}</p></Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
            
        {/each}
    </Card.Content>
</Card.Root>