<script>
  let imageEle;
  import gsap from "gsap";
  import { onMount } from "svelte";
  export let shouldLoadImages;
  export let img;

  $: {
    if (shouldLoadImages && img) {
      gsap.to(imageEle, {
        opacity: 1,
      });
    }
  }
</script>

<div class="item-container">
  <div class="image-container">
    <img
      bind:this={imageEle}
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
    max-width: 400px;
    width: 100%;
    .image-container {
      overflow: hidden;
      width: 100%;
      height: auto;
      .image {
        height: 100%;
        width: 100%;
        opacity: 0;
        object-fit: cover;
        object-position: center center;
      }
    }
  }
</style>
