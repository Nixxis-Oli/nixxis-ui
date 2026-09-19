<script lang="ts">
	import { Popover } from 'bits-ui';
	import type { AppEntry } from '../types.js';

	// The grid of applications, behind the nine-dot button. The list is a prop:
	// this package must never need a release because an application moved or a
	// new one appeared.
	type Props = {
		apps: AppEntry[];
		currentAppId?: string;
		label?: string;
	};

	let { apps, currentAppId, label = 'Switch application' }: Props = $props();
</script>

<Popover.Root>
	<Popover.Trigger
		aria-label={label}
		title={label}
		class="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
	>
		<!-- Inlined rather than pulled from an icon package: a shared component
			 should not force an icon library on the applications that host it. -->
		<svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
			<circle cx="3" cy="3" r="1.6" />
			<circle cx="9" cy="3" r="1.6" />
			<circle cx="15" cy="3" r="1.6" />
			<circle cx="3" cy="9" r="1.6" />
			<circle cx="9" cy="9" r="1.6" />
			<circle cx="15" cy="9" r="1.6" />
			<circle cx="3" cy="15" r="1.6" />
			<circle cx="9" cy="15" r="1.6" />
			<circle cx="15" cy="15" r="1.6" />
		</svg>
	</Popover.Trigger>

	<Popover.Portal>
		<Popover.Content
			side="bottom"
			align="end"
			sideOffset={8}
			class="bg-popover text-popover-foreground z-50 w-80 rounded-xl border p-2 shadow-lg"
		>
			{#if apps.length === 0}
				<p class="text-muted-foreground p-4 text-center text-sm">No application available.</p>
			{:else}
				<div class="grid grid-cols-3 gap-1">
					{#each apps as app (app.id)}
						{@const current = app.id === currentAppId}
						<a
							href={app.href}
							title={app.description ?? app.name}
							aria-current={current ? 'page' : undefined}
							class="hover:bg-accent focus-visible:ring-ring flex flex-col items-center gap-2 rounded-lg p-3 text-center transition-colors focus-visible:ring-2 focus-visible:outline-none"
						>
							<span
								class="flex size-11 items-center justify-center rounded-full text-sm font-semibold text-white"
								style:background-color={app.color ?? 'var(--primary)'}
							>
								{app.initials ?? app.name.slice(0, 2).toUpperCase()}
							</span>
							<span class="w-full truncate text-xs {current ? 'font-semibold' : ''}">
								{app.name}
							</span>
						</a>
					{/each}
				</div>
			{/if}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
