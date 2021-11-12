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
            <SculptureImage {shouldLoadImages} {img} />
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .flex-container {
    display: flex;
    gap: 20px;
    width: 100%;
    flex-wrap: wrap;
    max-width: 1700px;
    @media screen and (max-width: 800px) {
      gap: 10px;
    }
    @media screen and (max-width: 600px) {
      -ms-flex: 100%;
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
  .flex-col {
    &:last-child {
      justify-content: flex-start;
    }

    @media screen and (max-width: 800px) {
      flex: 49%;
      gap: 0px;
      max-width: 49%;
    }
    @media screen and (min-width: 800px) {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: calc(100% / 5);
      width: 100%;
    }
    @media screen and (max-width: 600px) {
      flex: 100%;
      max-width: 100%;
    }
  }
</style>
