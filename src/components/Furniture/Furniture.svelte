<script>
  import images from "./furniture.json";
  import FurnitureImage from "./FurnitureImage.svelte";
  export let shouldLoadImages;
</script>

<div class="container">
  <div class="flex-container">
    {#each images as img}
      <FurnitureImage {shouldLoadImages} {img} />
    {/each}
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
  }
  .flex-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    max-width: 1500px;
    margin-top: -1 * 0.5 * 1.5rem;
    margin-right: -1 * 0.5 * 1.5rem;
  }
</style>
