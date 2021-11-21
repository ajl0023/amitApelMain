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
      loading="lazy"
      class="image"
      src={img.img}
      alt=""
    />
  </div>
</div>

<style lang="scss">
  .expand-height {
    @media screen and (max-width: 900px) {
      height: 100%;
    }
  }
  .item-container {
    width: 100%;

    display: flex;
    @media screen and (max-width: 550px) {
      flex-direction: column-reverse;
    }
    @include globalMixins.flexGap(1, v);

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
    font-size: 1.5vh;
    padding: 0px 0px 0 10px;

    transform: rotate(-180deg);
    writing-mode: vertical-lr;
    text-align: right;
    @media screen and (max-width: 550px) {
      writing-mode: horizontal-tb;
      text-align: left;
      transform: none;
    }
  }
</style>
