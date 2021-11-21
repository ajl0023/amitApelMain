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
  .image-container {
    overflow: hidden;
    width: 100%;
 

    .image {
      width: 100%;
      height: 100%;

      object-fit: cover;
      object-position: center center;
    }
  }
  .item-container {
    width: 100%;
    height: 100%;
  }
</style>
