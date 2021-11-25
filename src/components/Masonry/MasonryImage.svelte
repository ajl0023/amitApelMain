<script>
  import { marqueeContentStore } from "./../Marquee/store.js";
  let imageEle;
  import gsap from "gsap";
  import { galleryModal } from "../GalleryModal/store.js";

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
  <div class="image-container m">
    <img
      width="{img.width}"
      height="{img.height}"
      loading="lazy"
      class="image"
      src="{$$props.loaded ? img.url : ''}"
      alt=""
    />
  </div>
</div>

<style lang="scss">
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
    position: relative;

    .image {
      opacity: 1;
      width: 100%;
      height: 100%;
      display: block;
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
