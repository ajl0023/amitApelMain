import sveltePreprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-static";
import path, { dirname } from "path";

import { fileURLToPath, pathToFileURL } from "url";
const filename = fileURLToPath(import.meta.url);

const sassPath = pathToFileURL(
  path.resolve(`${dirname(filename)}/src/miscStyles/globalMixins.scss`)
);

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
      prependData: `@use '${sassPath.pathname}';`,
    },
    postcss: {
      plugins: function (x, mu) {},
    },
  }),
};
