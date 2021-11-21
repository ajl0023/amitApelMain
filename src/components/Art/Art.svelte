<script>
  import images from "./Art.json";
  import ArtImage from "./ArtImage.svelte";

  export let shouldLoadImages;
</script>

<div class="container">
  <div class="flex-container">
    {#each images as img}
      <div class="item-container">
        <ArtImage {img} {shouldLoadImages} />
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

    width: 100%;
  }
  .flex-container {
    display: flex;

    flex-wrap: wrap;
    width: 100%;

    max-width: 1700px;
    // margin-top: -1 * 0.5 * 1.5rem;
    // margin-right: -1 * 0.5 * 1.5rem;
  }
  .item-container {
    flex: calc(100% / 6);
    width: 100%;
    // @include globalMixins.flexGap(1, vh);
    cursor: pointer;

    @media screen and (max-width: 900px) {
      flex: calc(100% / 5);
    }

    @media screen and (max-width: 600px) {
      flex: calc(100% / 3);
    }
    @media screen and (max-width: 480px) {
      flex: calc(100% / 1);
    }
  }
</style>
