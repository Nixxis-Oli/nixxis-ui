<script lang="ts">
	import type { Snippet } from 'svelte';
	import AppSwitcher from './app-switcher.svelte';
	import SettingsPanel from './settings-panel.svelte';
	import UserMenu from './user-menu.svelte';
	import type { AppEntry, OrganizationEntry, UserSummary } from '../types.js';
	import type { PaletteOption } from '../theme.svelte.js';
	import { session } from '../session.svelte.js';

	// The right-hand end of a toolbar, and only that: the application owns the
	// rest of the bar. This renders an inline-flex cluster with no width, no
	// background and no border of its own, so it drops into whatever the host
	// already has.
	type Props = {
		apps: AppEntry[];
		/** The account to show when no sign-in is stored for this tab. */
		user: UserSummary;
		currentAppId?: string;
		/** Palettes the settings panel offers. The application's CSS defines them. */
		palettes?: PaletteOption[];
		onSignOut?: () => void;
		/** Organizations the account belongs to, for the picker in the menu. */
		organizations?: OrganizationEntry[];
		currentOrganizationId?: string;
		onOrganizationChange?: (id: string) => void;
		/** Extra entries for the account menu. */
		menuItems?: Snippet;
		/** Anything the application wants between its own content and this cluster. */
		before?: Snippet;
		class?: string;
	};

	let {
		apps,
		user,
		currentAppId,
		palettes = [],
		onSignOut,
		organizations = [],
		currentOrganizationId,
		onOrganizationChange,
		menuItems,
		before,
		class: className = ''
	}: Props = $props();

	// Who is signed in is a cross-application question, like the theme: the
	// answer is held once, in the package, so the avatar cannot differ between
	// two applications showing the same person.
	$effect(() => {
		session.hydrate(user);
	});

	function signOut() {
		session.signOut();
		onSignOut?.();
	}
</script>

<div class="flex items-center gap-1 {className}">
	{#if before}
		{@render before()}
	{/if}

	{#if palettes.length}
		<SettingsPanel {palettes} />
	{/if}

	<AppSwitcher {apps} {currentAppId} />
	<UserMenu
		user={session.user ?? user}
		onSignOut={signOut}
		{organizations}
		{currentOrganizationId}
		{onOrganizationChange}
		items={menuItems}
	/>
</div>
