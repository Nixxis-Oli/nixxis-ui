export interface AppEntry {
	/** Stable identifier, used to mark the current application. */
	id: string;
	name: string;
	/** Absolute URL. The switcher never builds URLs itself. */
	href: string;
	/** Short mark shown on the tile: one or two characters, or an emoji. */
	initials?: string;
	/** Any CSS colour for the tile background. Falls back to the host's primary. */
	color?: string;
	description?: string;
}

export interface UserSummary {
	name: string;
	email?: string;
	/** Optional picture; initials are shown when absent or while it loads. */
	avatarUrl?: string;
}
