<script>
  import PrivateHomesGallery from "./PrivateHomesGallery.svelte";
  import { images } from "./images";
  import privateHomes from "./privateHomeFinal.json";
  let shouldShowGallery = false;
  let selected = null;
  const closeModal = () => {
    selected = null;
    shouldShowGallery = false;
  };
</script>

<div class="container">
  <div class="content-container">
    <h5 class="main-text-header">Private Homes</h5>
    <div class="gallery-container">
      {#each images as img}
        <div
          on:click={() => {
            selected = img.address;
            shouldShowGallery = true;
          }}
          class="grid-item-container"
        >
          <div class="image-container">
            <img loading="lazy" class="grid-image" src={img.img} alt="" />
          </div>
          <h5 class="label">{img.label}</h5>
        </div>
      {/each}
    </div>
  </div>
</div>
{#if shouldShowGallery && privateHomes[selected]}
  <PrivateHomesGallery
    on:closeModal={closeModal}
    selected={privateHomes[selected]}
  />
{/if}

<style lang="scss">
  .grid-item-container {
    display: flex;
    flex-direction: column;
    .label {
      text-align: left;
      font-size: 2em;
      line-height: 0.8em;
      font-weight: 900;
      letter-spacing: 3px;
      font-family: unisansB;
      padding: 1.2rem;
      color: #68208e;
      text-transform: uppercase;
    }
    .image-container {
      width: 100%;
      cursor: pointer;
      height: 100%;
      .grid-image {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    }
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    padding-top: 10rem;
    justify-content: center;
  }
  .gallery-container {
    margin-top: 5rem;
    display: grid;
    max-width: 1300px;
    width: 100%;
    gap: 31px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
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
