<script lang="ts">
	import { Avatar, DropdownMenu } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import type { UserSummary } from '../types.js';

	// The avatar at the far right, with whatever the host application wants to put
	// in its menu. `items` is a snippet so the package does not have to know about
	// the entries - only sign-out is offered directly, being universal.
	type Props = {
		user: UserSummary;
		onSignOut?: () => void;
		items?: Snippet;
	};

	let { user, onSignOut, items }: Props = $props();

	const initials = $derived(
		user.name
			.split(/\s+/)
			.slice(0, 2)
			.map((part) => part[0] ?? '')
			.join('')
			.toUpperCase() || '?'
	);
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
			<Avatar.Fallback>{initials}</Avatar.Fallback>
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

			{#if items}
				<DropdownMenu.Separator class="bg-border -mx-1 my-1 h-px" />
				{@render items()}
			{/if}

			{#if onSignOut}
				<DropdownMenu.Separator class="bg-border -mx-1 my-1 h-px" />
				<DropdownMenu.Item
					onSelect={onSignOut}
					class="data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground cursor-default rounded-sm px-3 py-2 text-sm outline-none select-none"
				>
					Sign out
				</DropdownMenu.Item>
			{/if}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
