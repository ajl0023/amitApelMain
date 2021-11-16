<script>
  import { onMount } from "svelte";

  import { largeBarObj } from "./animationObj";
  import { introAnimationStore } from "../../animationController";
  export let barIndex;

  let bar;

  onMount(() => {
    const ele = document.querySelector(`.target-${barIndex.index}`);

    introAnimationStore.update((s) => {
      s.bars = [
        ...s.bars,
        {
          ele: bar,
          parentEle: ele,
          index: barIndex.index,
        },
      ];

      return s;
    });
  });
</script>

<div
  style=""
  bind:this={bar}
  class="target-bar container container-{barIndex.index}"
>
  <video
    autoplay
    muted
    class="cover-video"
    src={largeBarObj[barIndex.index].img}
  />
</div>

<style lang="scss">
  .container {
    bottom: 50%;
    aspect-ratio: 0.5;
    width: 15%;
    pointer-events: none;
    opacity: 0;

    transform: translateY(50%);
    @media screen and (max-width: 780px) {
      display: none;
    }
  }
  .container-5 {
    position: fixed;

    left: 10%;
  }
  .container-11 {
    position: fixed;

    left: 30%;
  }
  .container-17 {
    position: fixed;

    right: 30%;
  }
  .container-23 {
    position: fixed;

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
