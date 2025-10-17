<script lang="ts">

	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Button } from '../button';
	import { NAVEGATION_BUTTONS } from './constants';

</script>


<Sidebar.Root viewTransitionName="main-sidebar" variant="floating" side="right">
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel >My Site:</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each NAVEGATION_BUTTONS as button (button.slug)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton class="flex justify-start
							">
								{#snippet child({ props })}
									<Button variant="link" href={button.url} {...props}>
										<button.icon />
										<span>{button.slug}</span>
									</Button>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>

