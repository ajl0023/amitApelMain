<script>
  import { marqueeContentStore } from "./../Marquee/store.js";

  import gsap from "gsap";
  import { galleryModal } from "../GalleryModal/store.js";
  export let img;

  let imageEle;
  $: {
    if ($marqueeContentStore.shouldLoadImages && img) {
      gsap.to(imageEle, {
        opacity: 1,
      });
    }
  }
  console.log(imageEle);
</script>

{#if img.url.length === 0}
  <i class="grid-item-container" aria-hidden="true"></i>
{:else}
  <div
    on:click="{() => {
      galleryModal.openModal(img, $marqueeContentStore.content);
    }}"
    bind:this="{imageEle}"
    class="grid-item-container"
  >
    <div class="image-container">
      <img
        height="{img.height}"
        width="{img.width}"
        loading="lazy"
        class="grid-image"
        src="{img.url}"
        alt=""
      />
    </div>
    <h5 class="label">{img.label}</h5>
  </div>
{/if}

<style lang="scss">
  .grid-item-container {
    display: flex;
    flex: calc(100% / 5);
    opacity: 1;
    flex-direction: column;

    @media screen and (max-width: 975px) {
      flex: calc(100% / 3);
    }
    @media screen and (max-width: 600px) {
      flex: 100%;
      max-width: 100%;
    }
    .label {
      text-align: left;
      font-size: 1em;
      line-height: 0.8em;
      font-weight: 900;
      letter-spacing: 3px;
      font-family: unisansB;
      padding: 1.2rem;
      color: #68208e;
      text-transform: uppercase;
    }
    .image-container {
      cursor: pointer;
      height: 300px;
      width: 100%;

      overflow: hidden;
      @media screen and (max-width: 600px) {
        height: auto;
        width: 100%;
      }
      .grid-image {
        object-fit: cover;
        width: 100%;
        height: 100%;
        object-position: center center;
      }
    }
  }
</style>
