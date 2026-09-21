import type { UserSummary } from './types.js';

const USER_KEY = 'nixxis-user';

/**
 * Who is signed in, shared by every application on the origin.
 *
 * Temporary stand-in for a real session: a signed cookie or token would carry
 * this, and the applications would read it from one endpoint. sessionStorage is
 * used rather than localStorage because a sign-in should not outlive the browser
 * tab.
 *
 * Two limits worth knowing. sessionStorage is scoped to the ORIGIN and to the
 * TAB: the deployed applications share one origin, so moving between them
 * through the switcher carries the user along, but in development they run on
 * different ports - different origins - so each keeps its own copy. And a fresh
 * tab starts empty, which is why `hydrate` takes a fallback rather than
 * rendering nobody.
 */
class SharedSession {
	user = $state<UserSummary | null>(null);

	/** Called once by ToolbarActions, with the account to show when none is stored. */
	hydrate(fallback: UserSummary) {
		this.user = this.read() ?? fallback;
	}

	/**
	 * The stored user, with no fallback - for an application that gates its routes
	 * and has to tell "signed in as the default account" from "not signed in".
	 */
	restore(): UserSummary | null {
		this.user = this.read();
		return this.user;
	}

	signIn(user: UserSummary) {
		this.user = user;
		this.write(user);
	}

	signOut() {
		this.user = null;

		try {
			sessionStorage.removeItem(USER_KEY);
		} catch {
			// Blocked storage: nothing was stored in the first place.
		}
	}

	private read(): UserSummary | null {
		if (typeof sessionStorage === 'undefined') {
			return null;
		}

		try {
			const raw = sessionStorage.getItem(USER_KEY);

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

	private write(user: UserSummary) {
		try {
			sessionStorage.setItem(USER_KEY, JSON.stringify(user));
		} catch {
			// Blocked storage: the sign-in just does not survive a navigation.
		}
	}
}

export const session = new SharedSession();
