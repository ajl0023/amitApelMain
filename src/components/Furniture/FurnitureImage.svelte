<script>
  import { marqueeContentStore } from "./../Marquee/store.js";
  import { modalStore } from "./../Modal/store.js";
  import gsap from "gsap";

  export let img;
  let imageEle;

  $: {
    if ($marqueeContentStore.shouldLoadImages && img) {
      gsap.to(imageEle, {
        opacity: 1,
      });
    }
  }
</script>

{#if img.url.length === 0}
  <i class="item-container" aria-hidden="true" />
{:else}
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
    <h5 class="label">{img.label}</h5>
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
{/if}

<style lang="scss">
  .label {
    writing-mode: vertical-lr;
    text-align: left;
    font-size: 1em;
    line-height: 0.8em;
    font-weight: 900;
    transform-origin: center center;
    letter-spacing: 3px;
    font-family: unisansB;
    padding: 1.2rem 1.2rem 0 0;
    float: left;
    color: #68208e;
    text-transform: uppercase;
    @media screen and (max-width: 600px) {
      writing-mode: horizontal-tb;
    }
  }
  .item-container {
    width: 100%;
    display: flex;
    flex: 32%;
    opacity: 0;

    cursor: pointer;
    @include globalMixins.flexGap(1, vh);
    margin-right: 0px;
    .image-container {
      width: 100%;
      height: 100%;
      float: right;
      .image {
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;

        object-position: center center;
      }
    }
    @media screen and (max-width: 800px) {
      flex: 48%;
    }
    @media screen and (max-width: 600px) {
      flex: 100%;

      flex-direction: column-reverse;
    }
  }
</style>
