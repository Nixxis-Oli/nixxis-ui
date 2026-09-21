/**
 * Whether there is room beside the account menu for its organization submenu.
 *
 * The submenu is a flyout: it needs the menu's own 15rem, the half-rem gap and
 * its own 14rem beside it. Under about 32rem of viewport neither side has that
 * room, so the panel is pushed back over its own parent and clipped against the
 * edge of the screen. Below the threshold the picker is rendered inline in the
 * menu instead.
 *
 * This cannot be a CSS breakpoint. The two shapes differ in STRUCTURE, not in
 * appearance, and rendering both to hide one with a media query would leave the
 * hidden entries in the menu's roving focus and typeahead order - reachable by
 * keyboard while invisible.
 */
const ROOM_FOR_SUBMENU = '(min-width: 32rem)';

function createMediaQuery(query: string) {
	// There is no window while a page is being prerendered. Starting false settles
	// on the shape that works at every width, so the first client render can only
	// widen it - and the menu's contents are not in the prerendered HTML anyway,
	// since a closed menu renders nothing.
	let matches = $state(false);

	if (typeof window !== 'undefined') {
		const list = window.matchMedia(query);

		matches = list.matches;

		// Module scope, never torn down: one listener for the lifetime of the page,
		// which is what a singleton buys over subscribing per component instance.
		list.addEventListener('change', (event) => (matches = event.matches));
	}

	return {
		get matches() {
			return matches;
		}
	};
}

export const roomForSubmenu = createMediaQuery(ROOM_FOR_SUBMENU);
