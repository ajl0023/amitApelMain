<script>
  import gsap from "gsap";
  import { galleryModal } from "../GalleryModal/store";
  import { marqueeContentStore } from "./../Marquee/store";
  import { lazy } from "./../lazy";
  import { onMount } from "svelte";
  export let img;

  let imageEle;

  export let url;
  export let content;

  $: {
    if (img) {
      if ($marqueeContentStore.shouldLoadImages) {
        gsap.to(imageEle, {
          opacity: 1,
        });
      } else if (!$marqueeContentStore.shouldLoadImages) {
        gsap.to(imageEle, {
          opacity: 0,
        });
      }
    }
  }
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
    <div class="aspect-ratio"></div>
    <div class="inner-item-container">
      <div class="image-container">
        <img
          use:lazy="{img.url}"
          height="{img.height}"
          width="{img.width}"
          loading="lazy"
          class="grid-image lazy"
          data-src="{img.url}"
          alt=""
        />
      </div>
      <h5 class="label">{img.label}</h5>
    </div>
  </div>
{/if}

<style lang="scss">
  .aspect-ratio {
    width: 100%;

    padding-bottom: 95%;
    @media screen and (max-width: 420px) {
      padding-bottom: 75%;
    }
  }
  .grid-item-container {
    display: flex;

    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 10px solid transparent;
    flex: calc(100% / 5);
    position: relative;
    opacity: 0;
    flex-direction: column;

    @media screen and (max-width: 975px) {
      flex: calc(100% / 3);
    }
    @media screen and (max-width: 600px) {
      flex: 50%;
    }
    @media screen and (max-width: 420px) {
      flex: 100%;
    }
    .label {
      text-align: left;
      font-size: 0.8em;
      line-height: 0.8em;

      letter-spacing: 3px;
      font-family: "Roboto Mono", monospace;
      font-weight: 600;
      padding: 1.2rem;
      color: #68208e;
      text-transform: uppercase;
      @media screen and (max-width: 600px) {
        font-size: 0.8em;
      }
    }
    .image-container {
      cursor: pointer;

      width: 100%;
      height: 100%;
      display: flex;
      overflow: hidden;
      @media screen and (max-width: 600px) {
        width: 100%;
      }
    }
    .inner-item-container {
      position: absolute;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
    }
  }
  .grid-image {
    object-fit: cover;
    width: 100%;
    z-index: 10;
    position: relative;
    height: 100%;
    object-position: center center;
  }
</style>
