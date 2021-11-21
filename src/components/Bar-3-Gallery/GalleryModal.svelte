<script>
  import { marqueeContentStore } from "./../Marquee/store.js";
  import { layout } from "./layout.js";
  import { privateHomesModal } from "./store.js";
  import { createEventDispatcher } from "svelte";
  const images = layout[$marqueeContentStore.content].images;

</script>

<div
  on:click={(e) => {
    privateHomesModal.closeModal();
  }}
  class="modal-container"
>
  <div
    on:click={(e) => {
      privateHomesModal.closeModal();
    }}
    class="close-x close-main"
  />
  <div class="gallery-container-flex">
    <div class="gallery-container">
      {#if images[$privateHomesModal.selected]}
        {#each images[$privateHomesModal.selected].images as img}
          <div class="image-container">
            <img
              on:click={(e) => {
                e.stopImmediatePropagation();
              }}
              class="gallery-img"
              src={img.url}
              alt=""
            />
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .modal-container {
    z-index: 10;
    position: fixed;
    height: 100vh;
    width: 100vw;
    overflow-y: auto;
    top: 0;

    padding: 20px;
    right: 0;
    background-color: rgba(10, 10, 10, 0.705);
  }
  .gallery-container-flex {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .gallery-container {
    max-width: 800px;
    width: 100%;
    display: flex;
    flex-direction: column;
    @include globalMixins.flexGap(0.4, v);
  }
  .image-container {
    width: 100%;

    .gallery-img {
      width: 100%;
      object-fit: cover;
    }
  }
</style>
