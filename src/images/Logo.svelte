<script>
  import { onDestroy, onMount } from "svelte";
  import { Motion, useAnimation } from "svelte-motion";
  import { largeBarObj, largeBarsArr } from "../animationObj";
  import Bar from "../components/Bar.svelte";
  import LargeBar from "../components/LargeBar.svelte";
  import "../global.scss";
  import gsap from "gsap";

  onDestroy(() => {});

  const bars = Array.from(" ".repeat(27));
  const animations = [];
  let container;
  let shouldPulse = false;
  let completed = false;
  onMount(() => {
    gsap.to(container, {
      height: "40vh",
      duration: 5,
    });
  });
</script>

<div bind:this={container} class="bar-container">
  {#each bars as bar, i}
    <Bar index={i} />
  {/each}

  {#each largeBarsArr as bar, i}
    <LargeBar
      on:stopPulse={() => {
        console.log("stopppped");
        shouldPulse = false;
      }}
      on:startPulse={() => {
        console.log("stopppped");
        shouldPulse = true;
      }}
      on:complete={() => {
        animations.push(i);
        if (animations.length === 4) {
          completed = true;
          shouldPulse = true;
        }
      }}
      {shouldPulse}
      {completed}
      custom={bar.index}
      barObj={bar}
    />
  {/each}
</div>

<style lang="scss">
  .bar-container {
    height: 70vh;
    z-index: 3;
    display: flex;
    gap: 20px;
    width: 100%;
    align-items: center;
    justify-content: center;

    position: relative;
  }
</style>
