<script lang="ts">
	import { Popover } from 'bits-ui';
	import type { AppEntry } from '../types.js';

	// The applications behind the nine-dot button. The list is a prop: this
	// package must never need a release because an application moved or a new one
	// appeared.
	//
	// Laid out as rows rather than centred tiles - a mark, a title and one line of
	// explanation each. A sentence of context is worth more than a fourth column
	// when the question being answered is "which of these do I want?".
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
			class="bg-popover text-popover-foreground z-50 w-[22rem] max-w-[calc(100vw-2rem)] rounded-xl border p-2 shadow-lg"
		>
			{#if apps.length === 0}
				<p class="text-muted-foreground p-4 text-center text-sm">No application available.</p>
			{:else}
				<ul>
					{#each apps as app (app.id)}
						{@const current = app.id === currentAppId}
						<li>
							<a
								href={app.href}
								aria-current={current ? 'page' : undefined}
								class="hover:bg-accent focus-visible:ring-ring flex items-start gap-3 rounded-lg p-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
							>
								<span
									class="flex size-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white"
									style:background-color={app.color ?? 'var(--primary)'}
								>
									{app.initials ?? app.name.slice(0, 2).toUpperCase()}
								</span>

								<span class="min-w-0 flex-1">
									<span class="flex items-center gap-2">
										<span class="truncate text-sm font-medium">{app.name}</span>
										{#if current}
											<!-- Spelled out rather than coloured: the current entry has to
												 read as current without relying on hue. -->
											<span
												class="bg-secondary text-secondary-foreground shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
											>
												Current
											</span>
										{/if}
									</span>

									{#if app.description}
										<span class="text-muted-foreground mt-0.5 block text-xs leading-snug">
											{app.description}
										</span>
									{/if}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
