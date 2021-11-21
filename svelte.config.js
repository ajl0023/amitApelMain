import sveltePreprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-static";
import path, {
  dirname
} from 'path'

import flexGapPolyfill from 'flex-gap-polyfill'
import {
  fileURLToPath
} from 'url'
const filePath = dirname(fileURLToPath(
  import.meta.url))
const sassPath = `${filePath}/src/miscStyles/`

export default {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
    adapter: adapter({
      // default options are shown
      pages: "./build",
      assets: "./build",
      fallback: null,
    }),
  },
  preprocess: sveltePreprocess({
    sourceMap: false,

    scss: {
      prependData: `@use '${sassPath}globalMixins.scss';`




    },
    postcss: {
      plugins: function (x, mu) {







      }
    }
  }),
};