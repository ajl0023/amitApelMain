<script>
  import { cardStore } from "./../meetTheTeam/cardStore.js";
  import { modalStore } from "./store.js";
</script>

<div
  class="container"
  on:click={(e) => {
    modalStore.closeModal();
    e.stopPropagation();
  }}
>
  <div
    on:click={(e) => {
      e.stopPropagation();
    }}
    class="image-container"
  >
    <img src={$modalStore.content} alt="" class="image" />
  </div>
</div>

<style lang="scss">
  .container {
    position: fixed;
    height: 100vh;
    width: 100vw;
    overflow-y: auto;
    top: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    right: 0;
    z-index: 20;
    background-color: rgba(10, 10, 10, 0.705);
    .image-container {
      .image {
        max-height: 80vh;
        max-width: 60vw;
        height: auto;
        width: auto;
        object-fit: cover;
        object-position: center center;
      }
    }
  }
</style>
