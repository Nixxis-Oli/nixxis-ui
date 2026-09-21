import type { UserSummary } from './types.js';

const USER_KEY = 'nixxis-user';

/**
 * Who is signed in, shared by every application on the origin.
 *
 * Temporary stand-in for a real session: a signed cookie or token would carry
 * this, and the applications would read it from one endpoint.
 *
 * One limit worth knowing: storage is scoped to the ORIGIN. The deployed
 * applications share one, so moving between them through the switcher carries
 * the user along; in development they run on different ports - different
 * origins - so each keeps its own copy.
 */
class SharedSession {
	user = $state<UserSummary | null>(null);

	/**
	 * False until storage has been read. The prerendered HTML is built without a
	 * browser, so it must not claim an identity it cannot know - otherwise the
	 * first paint shows the default account and swaps it once the bundle runs.
	 */
	ready = $state(false);

	// Reading storage yields a fresh object every time. Callers live inside
	// effects, so the store must settle after the first read or the new identity
	// on each pass keeps waking whatever depends on it.
	private loaded = false;

	/**
	 * Called by ToolbarActions while it sets up - not from an effect, so that the
	 * first client-side render already knows who is signed in. On the server there
	 * is no storage to read and the session stays unresolved.
	 */
	hydrate(fallback: UserSummary) {
		if (this.loaded || typeof localStorage === 'undefined') {
			return;
		}

		this.loaded = true;
		this.user = this.read() ?? fallback;
		this.ready = true;
	}

	/**
	 * The stored user, with no fallback - for an application that gates its routes
	 * and has to tell "signed in as the default account" from "not signed in".
	 * Returns the value read rather than the field, so a caller inside an effect
	 * does not take a dependency on what it just wrote.
	 */
	restore(): UserSummary | null {
		const stored = this.read();

		this.loaded = true;
		this.user = stored;
		this.ready = true;

		return stored;
	}

	signIn(user: UserSummary) {
		this.loaded = true;
		this.ready = true;
		this.user = user;

		try {
			localStorage.setItem(USER_KEY, JSON.stringify(user));
		} catch {
			// Blocked storage: the sign-in just does not survive a navigation.
		}
	}

	signOut() {
		this.loaded = true;
		this.ready = true;
		this.user = null;

		try {
			localStorage.removeItem(USER_KEY);
		} catch {
			// Nothing was stored in the first place.
		}
	}

	private read(): UserSummary | null {
		if (typeof localStorage === 'undefined') {
			return null;
		}

		try {
			const raw = localStorage.getItem(USER_KEY);

			if (!raw) {
				return null;
			}

			const parsed = JSON.parse(raw) as UserSummary;

			// Storage is user-writable; a malformed entry must not take the menu down.
			return typeof parsed?.name === 'string' ? parsed : null;
		} catch {
			return null;
		}
	}
}

export const session = new SharedSession();
