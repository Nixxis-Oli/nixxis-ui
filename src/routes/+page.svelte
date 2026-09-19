<script lang="ts">
	import { ToolbarActions, type AppEntry, type UserSummary } from '$lib/index.js';

	// A stand-in host application, so the cluster can be developed in isolation.
	const apps: AppEntry[] = [
		{ id: 'admin', name: 'Admin', href: '#', initials: 'AD', color: '#2563eb' },
		{ id: 'studio', name: 'Bot studio', href: '#', initials: 'BS', color: '#7c3aed' },
		{ id: 'reporting', name: 'Reporting', href: '#', initials: 'RE', color: '#059669' },
		{ id: 'supervision', name: 'Supervision', href: '#', initials: 'SU', color: '#d97706' },
		{ id: 'agents', name: 'Agent desk', href: '#', initials: 'AG', color: '#dc2626' },
		{ id: 'settings', name: 'Settings', href: '#', initials: 'SE', color: '#475569' }
	];

	const user: UserSummary = { name: 'Olivier Lambert', email: 'o.lambert@nixxis.com' };
</script>

<svelte:head><title>@nixxis-oli/ui playground</title></svelte:head>

<!-- Everything outside <ToolbarActions> is what an application would own. -->
<header class="flex h-14 items-center gap-4 border-b px-4">
	<span class="font-semibold">Host application</span>

	<nav class="text-muted-foreground flex gap-4 text-sm">
		<a href="#top">Overview</a>
		<a href="#top">Chat bots</a>
		<a href="#top">Reporting</a>
	</nav>

	<ToolbarActions {apps} {user} currentAppId="admin" class="ms-auto" onSignOut={() => alert('sign out')} />
</header>

<main class="space-y-3 p-8">
	<h1 class="text-xl font-semibold">Toolbar actions</h1>
	<p class="text-muted-foreground max-w-prose text-sm">
		The bordered bar above belongs to the host application. Only the cluster on the right - the
		application switcher and the account menu - comes from this package. It renders as an
		inline-flex group with no width, background or border of its own, so it drops into any toolbar.
	</p>
	<p class="text-muted-foreground max-w-prose text-sm">
		Colours come from the host's shadcn tokens. This page defines a minimal set in
		<code>app.css</code> purely so the components have something to resolve against.
	</p>
</main>
