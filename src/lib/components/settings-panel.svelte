<script lang="ts">
	import { Popover } from 'bits-ui';
	import { theme, type PaletteOption } from '../theme.svelte.js';

	// The gear, and the small panel behind it: palette and light/dark. Both are
	// cross-application concerns, which is why they sit in the shared package
	// rather than in each application's own settings screen.
	type Props = { palettes: PaletteOption[] };

	let { palettes }: Props = $props();

	$effect(() => {
		theme.hydrate(palettes);
	});
</script>

<Popover.Root>
	<Popover.Trigger
		aria-label="Appearance settings"
		title="Appearance"
		class="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
	>
		<!-- Inlined rather than pulled from an icon package: a shared component
			 should not force an icon library on the applications that host it. -->
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="3" />
			<path
				d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
			/>
		</svg>
	</Popover.Trigger>

	<Popover.Portal>
		<Popover.Content
			side="bottom"
			align="end"
			sideOffset={8}
			class="bg-popover text-popover-foreground z-50 w-64 space-y-4 rounded-xl border p-4 shadow-lg"
		>
			<div class="space-y-2">
				<p class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Palette</p>

				<div class="flex flex-wrap gap-2">
					{#each palettes as option (option.id)}
						<button
							type="button"
							title={option.label}
							aria-label={option.label}
							aria-pressed={theme.palette === option.id}
							onclick={() => theme.setPalette(option.id)}
							class="size-7 shrink-0 rounded-full border-2 transition-transform {theme.palette ===
							option.id
								? 'border-foreground scale-110'
								: 'border-transparent hover:scale-105'}"
							style:background-color={option.swatch}
						></button>
					{/each}
				</div>
			</div>

			<div class="flex items-center justify-between gap-3 border-t pt-3">
				<span class="text-sm">Dark mode</span>

				<button
					type="button"
					role="switch"
					aria-checked={theme.mode === 'dark'}
					aria-label="Dark mode"
					onclick={() => theme.toggleMode()}
					class="focus-visible:ring-ring inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:outline-none {theme.mode ===
					'dark'
						? 'bg-primary'
						: 'bg-secondary'}"
				>
					<span
						class="bg-background pointer-events-none block size-4 rounded-full shadow-lg transition-transform {theme.mode ===
						'dark'
							? 'translate-x-5'
							: 'translate-x-0'}"
					></span>
				</button>
			</div>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
