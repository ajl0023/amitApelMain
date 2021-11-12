<script>
  import { marqueeContentStore } from "./../Marquee/store.js";
  import { modalStore } from "./../Modal/store.js";
  let imageEle;
  import gsap from "gsap";

  export let img;

  $: {
    if ($marqueeContentStore.shouldLoadImages && img) {
      gsap.to(imageEle, {
        opacity: 1,
      });
    }
  }
</script>

<div
  bind:this={imageEle}
  on:click={() => {
    modalStore.update((s) => {
      s.content = img.url;
      s.visible = true;
      return s;
    });
  }}
  class="item-container"
>
  <div class="image-container">
    <img
      style="
        aspect-ratio:{img.width / img.height}; 
       "
      loading="lazy"
      class="image"
      src={img.url}
      alt=""
    />
  </div>
</div>

<style lang="scss">
  .item-container {
    flex: calc(100% / 6);
    width: 100%;
    cursor: pointer;
    opacity: 0;
    .image-container {
      overflow: hidden;
      width: 100%;
      height: 100%;

      .image {
        width: 100%;
        height: 100%;

        object-fit: cover;
        object-position: center center;
      }
    }
    @media screen and (max-width: 900px) {
      flex: calc(100% / 5);
    }

    @media screen and (max-width: 600px) {
      flex: calc(100% / 3);
    }
    @media screen and (max-width: 480px) {
      flex: calc(100% / 1);
    }
  }
</style>
