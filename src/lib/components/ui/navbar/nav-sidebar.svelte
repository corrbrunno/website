<script lang="ts">

	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { NAVEGATION_BUTTONS } from './constants';

</script>


<Sidebar.Root style="view-transition-name: side-navbar;" side="right">
	<Sidebar.Content >
		<Sidebar.Group>
			<Sidebar.GroupLabel>My Site:</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each NAVEGATION_BUTTONS as button (button.slug)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={button.url} {...props}>
										<button.icon />
										<span>{button.slug}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>

