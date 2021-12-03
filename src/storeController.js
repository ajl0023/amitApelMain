import { dev } from "$app/env";

export let testing = dev ? true : false;
export let shouldAnimate = dev ? false : true;
export let currentPage = "contact us";

// export let testing = false;
// export let shouldAnimate = false;
// export let currentPage = "malibu rebuild";