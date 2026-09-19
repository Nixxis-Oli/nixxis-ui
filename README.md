# @nixxis-oli/ui

Shared UI pieces for Nixxis Svelte applications. Currently one thing: the
right-hand end of an application toolbar — the application switcher and the
account menu.

Experimental. Names, props and package scope are all still up for discussion.

## What it is, and is not

`ToolbarActions` is a **segment**, not a bar. It renders an inline-flex cluster
with no width, no background and no border of its own, so it drops into whatever
toolbar the host application already has. Everything to its left belongs to the
application.

```svelte
<header class="flex h-14 items-center gap-4 border-b px-4">
	<span>My application</span>
	<nav>…the application's own links…</nav>

	<ToolbarActions {apps} {user} currentAppId="admin" class="ms-auto" onSignOut={signOut} />
</header>
```

## Three rules it follows

**It does not know which applications exist.** The list is a prop. A new
application, or one that moves, must never require a release of this package.

**It ships no colours.** Every surface uses the host's shadcn tokens —
`--primary`, `--popover`, `--border`, `--accent` and so on — so it takes on the
host's theme automatically. The consequence is that those token names have to be
the same across applications; agree on them before adding a second consumer.

**It forces no icon library.** The nine-dot mark is an inlined SVG. Application
tiles show initials on a colour the caller chooses.

## Installing in an application

```bash
npm install @nixxis-oli/ui
```

Tailwind 4 only generates classes it can see, and a dependency's markup sits
outside the default scan. Name it in the application's CSS:

```css
@source "../node_modules/@nixxis-oli/ui/dist";
```

`svelte` and `bits-ui` are peer dependencies: the application provides them, so
there is never a second copy of bits-ui in the bundle.

## Developing

```bash
npm run dev     # playground on :5180, a stand-in host application
npm run build   # svelte-package: src/lib -> dist
npm run check
```

The playground defines a minimal set of tokens in `src/app.css` purely so the
components have something to resolve against. None of it is published.

## Publishing to GitHub Packages

`publishConfig.registry` already points there. On a machine that publishes:

```bash
npm login --scope=@nixxis-oli --registry=https://npm.pkg.github.com
npm version minor
npm publish
```

Consuming applications need a line in their `.npmrc`:

```
@nixxis-oli:registry=https://npm.pkg.github.com
```

In CI, `NODE_AUTH_TOKEN` with `read:packages` is enough for consumers.

## Before this becomes real

- Decide the scope name — `@nixxis-oli` mirrors a personal GitHub account, an
  organisation scope would be better.
- Agree the shadcn token names across applications.
- Decide whether the application list comes from a prop or from a shared
  endpoint the host passes in.
- Add a changelog and pick a versioning discipline; consumers pin ranges.
