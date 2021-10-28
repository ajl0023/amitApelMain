<script>
  import SculptureImage from "./SculptureImage.svelte";
  import images from "./Sculptures.json";
  export let shouldLoadImages;
</script>

<div class="container">
  <h5 class="main-text-header">sculpture</h5>

  <div class="flex-container">
    {#each images as col}
      <div class="flex-col">
        {#each col as img}
          <SculptureImage {shouldLoadImages} {img} />
        {/each}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .flex-container {
    display: flex;
    gap: 20px;
    width: 100%;
    margin-top: 3rem;
    max-width: 1700px;
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 6rem;
    width: 100%;
  }
  .flex-col {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
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
</style>
