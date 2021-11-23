<script>
  import { marqueeContentStore } from "./../Marquee/store.js";
  import Bar3GalleryImage from "./Bar3GalleryImage.svelte";
  import { layout } from "./layout.js";

  export let shouldLoadImages;

  const componentPH = $marqueeContentStore.content === "private homes";
</script>

<div class="container">
  <div class="content-container">
    <div class="gallery-container">
      {#if $marqueeContentStore.content}
        {#each layout[$marqueeContentStore.content].thumbs as img}
          <Bar3GalleryImage {shouldLoadImages} {img} {componentPH} />
        {/each}
      {/if}
    </div>
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
    .content-container {
      width: 100%;
      max-width: 1200px;
    }
  }
  .gallery-container {
    display: grid;
    gap: 10px;
    overflow-y: auto;

    max-width: 1300px;

    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
</style>
