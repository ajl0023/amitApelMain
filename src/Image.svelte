<script>
  import { afterUpdate, beforeUpdate, onMount, tick } from "svelte";

  let url;

  // Only initialize it one time for the entire application
  if (!document.lazyLoadInstance) {
    document.lazyLoadInstance = new LazyLoad();
  }

  // Update lazyLoad after first rendering of every image

  async function test() {
    await tick();
    if (document.lazyLoadInstance && ele) {
      LazyLoad.resetStatus(ele);
      document.lazyLoadInstance.update();
    }
  }
  $: ele, content, test();
</script>

<slot />

<style lang="scss">
  .grid-image {
    object-fit: cover;
    width: 100%;
    z-index: 10;
    position: relative;
    height: 100%;
    object-position: center center;
  }
</style>
