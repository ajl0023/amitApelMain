<script>
  import { onMount } from "svelte";

  import { spring, tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { Motion } from "svelte-motion";
  export let index;
  export let offset;
  let bar;
  let shouldExpand = false;
  let largeAnimation = { width: 100, left: 0, scale: 10 };

  const initialLarge = [3, 28];

  let animationRunning = false;
  let hovered = false;
  let hoveredOut = 2;
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
  const largeInitialAnimation = tweened(
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
  onMount(() => {
    // largeInitialAnimation.set({
    //   width: 2,
    //   left: 6.9,
    //   scale: 1,
    // });
    // offset.set({
    //   rotate: 0,
    // });
    // alpha.set(1);
  });
</script>

{#if initialLarge.includes(index)}
  <Motion
    whileHover={{ scale: 1.2 }}
    variants={{
      scale1: {
        scale: 1.8,
      },
      scale2: {
        scale: 1,
        transition: { duration: hoveredOut, repeat: 0 },
      },
    }}
    initial="scale1"
    onHoverStart={() => {
      hoveredOut = 0.2;
    }}
    animate="scale2"
    let:motion
  >
    <div use:motion class="bar" on:click={expand} />
  </Motion>
{:else}
  <Motion
    variants={{
      1: {
        rotateX: index + 50 * (index + 1),
      },
      2: {
        rotateX: 0,
        transition: { duration: hoveredOut, repeat: 0 },
      },
    }}
    initial="1"
    animate="2"
    whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
    let:motion
  >
    <div use:motion class="bar" />
  </Motion>
{/if}

<style lang="scss">
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
      transform: scale(1.8);
    }

    &:nth-child(5) {
      left: 14.3%;
      top: 13.8%;
      height: 62%;
      width: 2.7%;
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
    }
  }
  .full-screen {
    position: fixed !important;
    left: 0 !important;
    width: 100vw !important;
  }
</style>
