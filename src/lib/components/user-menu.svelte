<script lang="ts">
	import { Avatar, DropdownMenu } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import type { OrganizationEntry, UserSummary } from '../types.js';

	// The avatar at the far right, with whatever the host application wants to put
	// in its menu. `items` is a snippet so the package does not have to know about
	// the entries; the organization picker and sign-out are here because they are
	// the same question in every application.
	type Props = {
		user: UserSummary;
		/** True while the session has not been read yet - see the style block below. */
		pending?: boolean;
		onSignOut?: () => void;
		items?: Snippet;
		/** Organizations the account belongs to. Fewer than two hides the picker. */
		organizations?: OrganizationEntry[];
		currentOrganizationId?: string;
		onOrganizationChange?: (id: string) => void;
	};

	let {
		user,
		pending = false,
		onSignOut,
		items,
		organizations = [],
		currentOrganizationId,
		onOrganizationChange
	}: Props = $props();

	const initials = $derived(
		user.name
			.split(/\s+/)
			.slice(0, 2)
			.map((part) => part[0] ?? '')
			.join('')
			.toUpperCase() || '?'
	);

	const currentOrganization = $derived(
		organizations.find((entry) => entry.id === currentOrganizationId)
	);

	// A submenu rather than a Select: a listbox portalled out of an open menu
	// fights it for outside-click and focus. The submenu is the pattern menus
	// already have for "pick one of these".
	const ITEM =
		'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground flex cursor-default items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none select-none';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		aria-label="Account menu"
		class="focus-visible:ring-ring rounded-full transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none"
	>
		<Avatar.Root
			class="bg-secondary text-secondary-foreground relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold"
		>
			{#if user.avatarUrl}
				<Avatar.Image src={user.avatarUrl} alt={user.name} class="size-full object-cover" />
			{/if}
			<Avatar.Fallback>
				{#if pending}
					<!-- Nothing is known yet. The letters come from CSS so the pre-paint
						 script in app.html can fill them in before the bundle runs. -->
					<span class="stored-initials" aria-hidden="true"></span>
				{:else}
					{initials}
				{/if}
			</Avatar.Fallback>
		</Avatar.Root>
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenu.Content
			side="bottom"
			align="end"
			sideOffset={8}
			class="bg-popover text-popover-foreground z-50 w-60 rounded-lg border p-1 shadow-lg"
		>
			<div class="px-3 py-2">
				<p class="truncate text-sm font-medium">{user.name}</p>
				{#if user.email}
					<p class="text-muted-foreground truncate text-xs">{user.email}</p>
				{/if}
			</div>

			{#if organizations.length}
				<DropdownMenu.Separator class="bg-border -mx-1 my-1 h-px" />

				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger class={ITEM}>
						<span class="min-w-0 flex-1">
							<span class="text-muted-foreground block text-[10px] tracking-wider uppercase">
								Organization
							</span>
							<span class="block truncate">{currentOrganization?.name ?? 'Choose...'}</span>
						</span>

						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="text-muted-foreground shrink-0"
							aria-hidden="true"
						>
							<path d="m9 18 6-6-6-6" />
						</svg>
					</DropdownMenu.SubTrigger>

					<DropdownMenu.SubContent
						sideOffset={8}
						class="bg-popover text-popover-foreground z-50 w-56 rounded-lg border p-1 shadow-lg"
					>
						<DropdownMenu.RadioGroup
							value={currentOrganizationId}
							onValueChange={(next) => onOrganizationChange?.(next)}
						>
							{#each organizations as organization (organization.id)}
								{@const unavailable = organization.ready === false}
								<DropdownMenu.RadioItem
									value={organization.id}
									disabled={unavailable}
									class="{ITEM} data-disabled:pointer-events-none data-disabled:opacity-50"
								>
									{#snippet children({ checked })}
										<!-- The check is the state, not the highlight: a menu row is
											 highlighted merely by being hovered. -->
										<span class="flex size-4 shrink-0 items-center justify-center">
											{#if checked}
												<svg
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2.5"
													stroke-linecap="round"
													stroke-linejoin="round"
													aria-hidden="true"
												>
													<path d="M20 6 9 17l-5-5" />
												</svg>
											{/if}
										</span>

										<span class="min-w-0 flex-1 truncate">{organization.name}</span>

										{#if unavailable}
											<span
												class="bg-muted text-muted-foreground shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
											>
												soon
											</span>
										{/if}
									{/snippet}
								</DropdownMenu.RadioItem>
							{/each}
						</DropdownMenu.RadioGroup>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			{/if}

			{#if items}
				<DropdownMenu.Separator class="bg-border -mx-1 my-1 h-px" />
				{@render items()}
			{/if}

			<!-- Always present. An account menu that offers no way out in one
				 application and does in another is the same menu behaving differently,
				 which is exactly what a shared component exists to prevent. -->
			<DropdownMenu.Separator class="bg-border -mx-1 my-1 h-px" />
			<DropdownMenu.Item onSelect={() => onSignOut?.()} class={ITEM}>Sign out</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>

<style>
	/*
		The application's pre-paint script copies the stored initials into
		--nixxis-initials, already quoted, exactly as it restores the palette. That
		happens before the first paint, so the right person is shown from the very
		first frame; the value is dropped once Svelte renders the real text.
	*/
	.stored-initials::after {
		content: var(--nixxis-initials, '');
	}
</style>
