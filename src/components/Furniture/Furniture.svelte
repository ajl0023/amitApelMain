<script>
  import images from "./furniture.json";
  import FurnitureImage from "./FurnitureImage.svelte";
  export let shouldLoadImages;
</script>

<div class="container">
  <h5 class="main-text-header">furniture</h5>

  <div class="flex-container">
    {#each images as col}
      <div class="flex-column">
        {#each col as img}
          <FurnitureImage {shouldLoadImages} {img} />
        {/each}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .flex-column {
    gap: 5px;
    flex-direction: column;
    display: flex;
    width: 100%;
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 6rem;
    width: 100%;
  }
  .flex-container {
    margin-top: 3rem;
    display: flex;
  }
  .main-text-header {
    font-size: 6em;
    line-height: 0.8em;
    font-weight: 900;
    letter-spacing: 3px;
    font-family: unisansB;
    text-align: center;
    color: #68208e;
    text-transform: uppercase;
  }
 

  .flex-container {
    width: 100%;
    max-width: 1900px;
  }
</style>
