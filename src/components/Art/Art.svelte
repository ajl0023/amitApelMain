<script>

  import images from "./Art.json";
  import ArtImage from "./ArtImage.svelte";

  export let shouldLoadImages;
</script>

<div class="container">


  <div class="flex-container">
    {#each images as col}
      {#each col as img}
        <ArtImage {img} {shouldLoadImages} />
      {/each}
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
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    width: 100%;

    max-width: 1700px;
  }

  .flex-cm {
    gap: 10px;
    width: 100%;
  }
</style>
