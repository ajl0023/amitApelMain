<script>
  import { modalStore } from "./../Modal/store.js";
  import gsap from "gsap";
  export let shouldLoadImages;
  export let img;
  let imageEle;

  $: {
    if (shouldLoadImages && img) {
      gsap.to(imageEle, {
        opacity: 1,
      });
    }
  }
</script>

<div
  on:click={() => {
    modalStore.update((s) => {
      s.content = img.url;
      s.visible = true;
      return s;
    });
  }}
  class="item-container"
>
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
    cursor: pointer;
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
