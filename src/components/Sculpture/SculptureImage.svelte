<script>
  let imageEle;
  import gsap from "gsap";
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
  .item-container {
    width: 100%;
    display: flex;
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
  .label {
    transform: rotate(-180deg);
    padding-left: 0.3rem;
    writing-mode: vertical-lr;
    text-align: right;
    font-size: 1em;
    line-height: 0.8em;
    font-weight: 900;
    letter-spacing: 3px;
    font-family: unisansB;

    color: #68208e;
    text-transform: uppercase;
  }
</style>
