<script>
  import images from "./furniture.json";
  import FurnitureImage from "./FurnitureImage.svelte";
  export let shouldLoadImages;
</script>

<div class="container">
  <div class="flex-container">
    {#each images as col}
      {#each col as img}
        <FurnitureImage {shouldLoadImages} {img} />
      {/each}
    {/each}
  </div>
</div>

<style lang="scss">
  .flex-column {
    gap: 5px;
    flex-direction: column;
    display: flex;
    width: 100%;
    height: fit-content;

    @media screen and (max-width: 800px) {
      flex: 49%;
      gap: 0px;
      max-width: 49%;
    }
    @media screen and (min-width: 800px) {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: calc(100% / 3);
      width: 100%;
    }
    @media screen and (max-width: 600px) {
      flex: 100%;
      max-width: 100%;
    }
  }

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
    gap: 10px;
    max-width: 1500px;
  }
</style>
