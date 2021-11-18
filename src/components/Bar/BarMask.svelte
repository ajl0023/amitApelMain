<script>
  import { onMount } from "svelte";

  import { largeBarObj } from "./animationObj";
  import { introAnimationStore } from "../../animationController";
  export let barIndex;

  let bar;
  let video;
  onMount(() => {
    const ele = document.querySelector(`.target-${$$props.index}`);

    introAnimationStore.update((s) => {
      s.bars = [
        ...s.bars,
        {
          ele: bar,
          parentEle: ele,
          index: $$props.index,
          video: video,
        },
      ];

      return s;
    });
  });
</script>

<div
  style=""
  bind:this={bar}
  class="target-bar container container-{$$props.index}"
>
  <video
    muted
    bind:this={video}
    class="cover-video"
    src={largeBarObj[$$props.index].img}
  />
</div>

<style lang="scss">
  .container {
    bottom: 50%;
    aspect-ratio: 0.5;
    width: 15%;
    pointer-events: none;
    opacity: 0;
    position: fixed;

    transform: translateY(50%);
    @media screen and (max-width: 650px) {
      display: none;
    }
  }
  .container-0 {
    left: 10%;
  }
  .container-1 {
    left: 30%;
  }
  .container-2 {
    right: 30%;
  }
  .container-3 {
    right: 10%;
  }
  .cover-video {
    height: 100%;

    &::-webkit-media-controls-panel {
      display: none !important;
      -webkit-appearance: none;
    }

    object-position: center center;
    width: 100%;

    object-fit: cover;
  }
</style>
