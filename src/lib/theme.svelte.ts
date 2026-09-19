const PALETTE_KEY = 'nixxis-palette';
const MODE_KEY = 'nixxis-mode';

export type Mode = 'light' | 'dark';

export interface PaletteOption {
	/** Written to data-palette on <html>; the application's CSS defines the rest. */
	id: string;
	label: string;
	/** Swatch colour for the picker. The package holds no palette of its own. */
	swatch: string;
}

/**
 * Theme state lives in the shared package because the toolbar owns the settings
 * panel - and because a user who picks a palette in one application expects to
 * find it in the next. The keys are deliberately unprefixed by application.
 *
 * The package never defines colours. It only stamps `data-palette` and the
 * `dark` class on <html>; each application's CSS decides what those mean.
 */
function read<T extends string>(key: string, fallback: T, allowed: readonly T[]): T {
	if (typeof localStorage === 'undefined') {
		return fallback;
	}

	try {
		const stored = localStorage.getItem(key);
		return allowed.includes(stored as T) ? (stored as T) : fallback;
	} catch {
		return fallback;
	}
}

class ThemeState {
	palette = $state('');
	mode = $state<Mode>('light');

	/** Called once by ToolbarActions, which knows the palettes on offer. */
	hydrate(palettes: PaletteOption[]) {
		const ids = palettes.map((entry) => entry.id);

		this.palette = read(PALETTE_KEY, ids[0] ?? '', ids);
		this.mode = read(MODE_KEY, 'light', ['light', 'dark'] as const);
		this.apply();
	}

	setPalette(id: string) {
		this.palette = id;
		this.apply();
	}

	toggleMode() {
		this.mode = this.mode === 'dark' ? 'light' : 'dark';
		this.apply();
	}

	private apply() {
		if (typeof document === 'undefined') {
			return;
		}

		if (this.palette) {
			document.documentElement.dataset.palette = this.palette;
		}

		document.documentElement.classList.toggle('dark', this.mode === 'dark');

		try {
			localStorage.setItem(PALETTE_KEY, this.palette);
			localStorage.setItem(MODE_KEY, this.mode);
		} catch {
			// Blocked storage: the choice just does not survive a reload.
		}
	}
}

export const theme = new ThemeState();
