<script>
  import { onMount } from "svelte";

  import { spring, tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  let bar;
  let shouldExpand = false;
  const delay = [];

  const initialLarge = [3, 28];
  export let index;
  export let offset;
  let hovered = false;
  let hoveredOut = false;
  const expand = (e) => {
    shouldExpand = !shouldExpand;

    hovered = false;
  };
  const hoverSpring = spring(
    { scale: 1, translateY: 0 },
    {
      easing: cubicOut,
    }
  );
  const progress = tweened(
    { width: 100, left: 0, scale: 10 },

    {
      duration: 4000,
      easing: cubicOut,
    }
  );
  let alpha = tweened(0, {
    duration: 4000,
    easing: cubicOut,
  });
  onMount(() => {});
  setTimeout(() => {
    progress.set({
      width: 2,
      left: 6.9,
      scale: 1,
    });
    offset.set({
      rotate: 0,
    });
    alpha.set(1);
  }, 1000);
</script>

<div
  bind:this={bar}
  class:sm={index !== 3 && index !== 4 && index !== 17 && index !== 30}
  class:lg={index === 3 || index === 4 || index === 17 || index === 30}
  style="
  
  {initialLarge.includes(index)
    ? `transform:scale(${$progress.scale});`
    : `transform:rotateX(${$offset.rotate}deg)`}; opacity:{$alpha};
 
  {hovered || hoveredOut
    ? `transform: translateY(${$hoverSpring.translateY}px) scale(${$hoverSpring.scale});`
    : ''}; 
"
  class:hovered
  class:full-screen={shouldExpand}
  class="bar"
  on:mouseenter={(e) => {
    hoverSpring.set({
      scale: 1.3,
      translateY: -20,
    });
    if (!shouldExpand) {
      hovered = true;
    }
  }}
  on:mouseleave={(e) => {
    hovered = false;
    hoveredOut = true;
    hoverSpring.set({
      scale: 1,
      translateY: 0,
    });
  }}
  on:click={expand}
/>

<style lang="scss">
  $largeAnimation: 8s;
  $largeAnimationTimingFunc: cubic-bezier(0.4, 0, 1, 1);
  @mixin animation($name, $tx) {
    @keyframes #{$name} {
    }
  }

  @keyframes openingSm {
  }

  .sm {
    animation: openingSm 8s;
  }

  .bar {
    z-index: 5;
    background-color: white;
    position: absolute;

    &:nth-child(1) {
      left: 2%;
      top: 13.8%;
      height: 62%;
      width: 1%;
    }
    &:nth-child(2) {
      left: 3.6%;
      top: 13.8%;
      height: 62%;
      width: 0.9%;
    }
    &:nth-child(3) {
      left: 6.9%;
      top: 13.9%;
      height: 62%;
      width: 2%;
    }
    &:nth-child(4) {
      left: 10.9%;
      top: 13.8%;
      height: 62%;
      width: 2.7%;
      @include animation(opening-4, 90px);
      animation: opening-4 $largeAnimation $largeAnimationTimingFunc;
    }

    &:nth-child(5) {
      left: 14.3%;
      top: 13.8%;
      height: 62%;
      width: 2.7%;
      @include animation(opening-5, 130px);
      animation: opening-5 $largeAnimation $largeAnimationTimingFunc;
    }
    &:nth-child(6) {
      left: 17.8%;
      top: 13.8%;
      height: 62%;
      width: 1.5%;
    }
    &:nth-child(7) {
      left: 20%;
      top: 13.8%;
      height: 62%;
      width: 1.1%;
    }
    &:nth-child(8) {
      left: 23.1%;
      top: 13.8%;
      height: 62%;
      width: 1.9%;
    }
    &:nth-child(9) {
      left: 25.7%;
      top: 13.8%;
      height: 62%;
      width: 1%;
    }
    &:nth-child(10) {
      left: 28.8%;
      top: 13.8%;
      height: 62%;
      width: 1%;
    }
    &:nth-child(11) {
      left: 32%;
      top: 13.8%;
      height: 62%;
      width: 1.9%;
    }
    &:nth-child(12) {
      left: 34.6%;
      top: 13.8%;
      height: 62%;
      width: 2.5%;
    }
    &:nth-child(13) {
      left: 46.6%;
      top: 13.8%;
      height: 62%;
      width: 1%;
    }
    &:nth-child(14) {
      left: 49.8%;
      top: 13.8%;
      height: 62%;
      width: 1.9%;
    }
    &:nth-child(15) {
      left: 54%;
      top: 13.8%;
      height: 62%;
      width: 0.9%;
    }
    &:nth-child(16) {
      left: 55.6%;
      top: 13.8%;
      height: 62%;
      width: 1.8%;
    }
    &:nth-child(17) {
      left: 59.5%;
      top: 13.8%;
      height: 62%;
      width: 1.1%;
    }
    &:nth-child(18) {
      left: 61.3%;
      top: 13.8%;
      height: 62%;
      width: 2.5%;
      @include animation(opening-18, -90px);
      animation: opening-18 $largeAnimation $largeAnimationTimingFunc;
    }
    &:nth-child(19) {
      left: 91.3%;
      top: 13.8%;
      height: 62%;
      width: 1.1%;
    }

    &:nth-child(20) {
      left: 64.5%;
      top: 13.8%;
      height: 62%;
      width: 1%;
    }
    &:nth-child(21) {
      left: 66.4%;
      top: 13.8%;
      height: 62%;
      width: 0.9%;
    }
    &:nth-child(22) {
      left: 69.4%;
      top: 13.8%;
      height: 62%;
      width: 1.9%;
    }
    &:nth-child(23) {
      left: 73.5%;
      top: 13.8%;
      height: 62%;
      width: 0.9%;
    }
    &:nth-child(24) {
      left: 75.1%;
      top: 13.8%;
      height: 62%;
      width: 2.7%;
    }
    &:nth-child(25) {
      left: 79.9%;
      top: 13.8%;
      height: 62%;
      width: 1.7%;
    }
    &:nth-child(26) {
      left: 82.5%;
      top: 13.8%;
      height: 62%;
      width: 0.8%;
    }
    &:nth-child(27) {
      left: 85.5%;
      top: 13.8%;
      height: 62%;
      width: 1.2%;
    }
    &:nth-child(28) {
      left: 88.9%;
      top: 13.8%;
      height: 62%;
      width: 1.7%;
    }
    &:nth-child(29) {
      left: 94.4%;
      top: 13.8%;
      height: 62%;
      width: 2.9%;
    }
    &:nth-child(30) {
      left: 97.9%;
      top: 13.8%;
      height: 62%;
      width: 1.7%;
      @include animation(opening-30, -130px);
      animation: opening-30 $largeAnimation $largeAnimationTimingFunc;
    }
  }
  .full-screen {
    position: fixed !important;
    left: 0 !important;
    width: 100vw !important;
    &:hover {
      content: none !important;
    }
  }
</style>
