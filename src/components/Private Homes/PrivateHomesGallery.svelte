<script>
  import { createEventDispatcher } from "svelte";
  export let selected;
  import privateHomes from "./privateHomeFinal.json";
  const dispatch = createEventDispatcher();
</script>

<div
  on:click={() => {
    dispatch("closeModal");
  }}
  class="modal-container"
>
  <div class="gallery-container-flex">
    <div class="gallery-container">
      {#each selected.images as img}
        <div class="image-container">
          <img class="gallery-img" src={img.url} alt="" />
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .modal-container {
    z-index: 20;
    position: fixed;
    height: 100vh;
    width: 100vw;
    overflow-y: auto;
    top: 0;
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
  }
  .image-container {
    width: 100%;

    .gallery-img {
      width: 100%;
      object-fit: cover;
    }
  }
</style>
