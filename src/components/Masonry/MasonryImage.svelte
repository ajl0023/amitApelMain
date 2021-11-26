<script>
  import { marqueeContentStore } from "./../Marquee/store";
  let imageEle;
  import gsap from "gsap";
  import { galleryModal } from "../GalleryModal/store";
  import Image from "../../Image.svelte";
  import { lazy } from "../lazy";

  export let img;

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

<div
  bind:this="{imageEle}"
  on:click="{() => {
    galleryModal.openModal(img, $marqueeContentStore.content);
  }}"
  class="item-container"
>
  {#if img.label}
    <div class="hover-element-container">
      <h5 class="hover-label">
        {img.label}
      </h5>
    </div>
  {/if}

  <div
    style="padding-top: {(img.height / img.width) * 100}%;"
    class="aspect-ratio-box"
  >
    <div class="image-container">
      <img
        width="{img.width}"
        height="{img.height}"
        class="image lazy"
        data-src="{img.url}"
        alt=""
        use:lazy="{img.url}"
      />
    </div>
  </div>
</div>

<style lang="scss">
  .aspect-ratio-box {
    height: 0;
    overflow: hidden;

    position: relative;
  }
  .hover-element-container {
    font-size: 2em;
    text-transform: uppercase;
    font-family: unisansB;
    color: #68208e;
    @media screen and (min-width: 430px) {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 2;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: white;
      font-size: 2em;
      &:hover {
        opacity: 1;
      }
    }
  }
  .image-container {
    overflow: hidden;
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    .image {
      opacity: 1;
      width: 100%;
      height: 100%;
      display: flex;
      object-fit: cover;
      object-position: center center;
    }
  }
  .item-container {
    width: 100%;
    overflow: hidden;

    position: relative;
    opacity: 0;
    height: 100%;
    @media screen and (max-width: 430px) {
      display: flex;

      flex-direction: column-reverse;
    }
  }
</style>
