<script>
  import SculptureImage from "./SculptureImage.svelte";
  import images from "./Sculptures.json";
  export let shouldLoadImages;
</script>

<div class="page-container">
  <div class="container">
    <div class="flex-container">
      {#each images as col}
        <div class="flex-col">
          {#each col as img}
            <div
              class:expand-height={img.expand}
              class="item-container flex-item "
            >
              <SculptureImage {shouldLoadImages} {img} />
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  @use "sass:math";
  .item-container {
    overflow: hidden;
    display: flex;
  }
  .flex-item {
    @include globalMixins.flexGap(1, vh);
  }
  .flex-col {
    display: flex;
    flex-direction: column;
    flex: math.div(100%, 4);

    @media screen and (max-width: 900px) {
      flex: math.div(100%, 2);
      .expand-height {
        flex-grow: 2;
      }
    }
    @media screen and (max-width: 550px) {
      flex: 100%;
    }
  }
  .flex-container {
    display: flex;
    max-width: 1800px;
    width: 100%;
    flex-wrap: wrap;
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
  }
</style>
