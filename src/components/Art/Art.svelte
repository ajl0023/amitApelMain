<script>
  import ArtImage from "./ArtImage.svelte";
  import images from "./Art.json";
  let imageEle;

  export let shouldLoadImages;
</script>

<div class="container">
  <h5 class="main-text-header">art</h5>

  <div class="flex-container">
    {#each images as col}
      <div class="flex-cm">
        {#each col as img}
          <ArtImage {img} {shouldLoadImages} />
        {/each}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 6rem;
    width: 100%;
  }
  .flex-container {
    display: flex;
    gap: 10px;
    width: 100%;
    margin-top: 3rem;
    max-width: 1700px;
  }
  .main-text-header {
    font-size: 3em;
    line-height: 0.8em;
    font-weight: 900;
    letter-spacing: 3px;
    font-family: unisansB;
    text-align: center;
    color: #68208e;
    text-transform: uppercase;
  }

  .flex-cm {
    gap: 10px;
    width: 100%;
  }
</style>
