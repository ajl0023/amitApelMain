<script>
  import { marqueeContentStore } from "./../Marquee/store.js";
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

<div class:expand-height={img.expand} class="item-container">
  <h5 class="label">{img.label}</h5>
  <div class="image-container">
    <img
      bind:this={imageEle}
      style="
      aspect-ratio:{img.width / img.height}; 
     "
      loading="lazy"
      class="image"
      src={img.img}
      alt=""
    />
  </div>
</div>

<style lang="scss">
  @media screen and (max-width: 800px) {
    .expand-height {
      height: 23.8%;
      .image-container {
        height: 100%;
      }
    }
  }

  .item-container {
    width: 100%;
    display: flex;
    @media screen and (max-width: 800px) {
      flex-direction: column;
    }
    .image-container {
      overflow: hidden;
      width: 100%;

      .image {
        height: 100%;
        width: 100%;
        opacity: 0;
        object-fit: cover;
        object-position: center center;
      }
    }
  }
  .label {
    color: #68208e;
    font-family: unisansB;
    font-size: 1em;
    padding: 5px;
    @media screen and (min-width: 800px) {
      transform: rotate(-180deg);
      padding-left: 0.3rem;
      writing-mode: vertical-lr;
      text-align: right;

      line-height: 0.8em;
      font-weight: 900;
      letter-spacing: 3px;

      text-transform: uppercase;
    }
  }
</style>
