import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// The library is built by svelte-package from src/lib. The SvelteKit app around
// it exists only as a playground for developing the components.
/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ pages: 'playground', assets: 'playground', fallback: '404.html' })
  }
};
