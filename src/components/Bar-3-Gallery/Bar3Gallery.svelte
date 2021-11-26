<script>
  import { marqueeContentStore } from "./../Marquee/store.js";
  import Bar3GalleryImage from "./Bar3GalleryImage.svelte";
  import { layout } from "./layout.js";

  export let shouldLoadImages;
  $: ({ content } = $marqueeContentStore);
</script>

<div class="container">
  <div class="gallery-container flex-gap-not-supported">
    {#if content}
      {#each layout[content].thumbs as img}
        <Bar3GalleryImage
          content="{content}"
          shouldLoadImages="{shouldLoadImages}"
          img="{img}"
        />
      {/each}
    {/if}
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    overflow: hidden;
    justify-content: center;
  }
  .gallery-container {
    // margin-top: -10px;
    // margin-left: -10px;
    // margin-right: -10px;

    overflow-y: auto;

    max-width: 1300px;
    justify-content: space-around;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
</style>
