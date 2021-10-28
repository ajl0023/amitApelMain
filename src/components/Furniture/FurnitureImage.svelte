<script>
  import gsap from "gsap";
  import { onMount } from "svelte";
  export let shouldLoadImages;
  export let img;
  let imageEle;

  $: {
    console.log(shouldLoadImages);
    if (shouldLoadImages && img) {
      gsap.to(imageEle, {
        opacity: 1,
      });
    }
  }
</script>

<div class="item-container">
  <h5 class="label">{img.label}</h5>
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
  .label {
    transform: rotate(-180deg);

    writing-mode: vertical-lr;
    text-align: right;
    font-size: 2em;
    line-height: 0.8em;
    font-weight: 900;
    letter-spacing: 3px;
    font-family: unisansB;
    padding: 1.2rem;
    color: #68208e;
    text-transform: uppercase;
  }
  .item-container {
    display: flex;
    width: 100%;
    .image-container {
      width: 100%;

      .image {
        height: 100%;
        width: 100%;
        opacity: 0;
        object-position: center center;
      }
    }
  }
</style>
