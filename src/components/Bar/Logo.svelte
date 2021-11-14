<script>
  import gsap from "gsap";
  import { onMount } from "svelte";
  import { shouldAnimate } from "./../../animationController.js";
  import { largeBarsArr } from "./animationObj";
  import Bar from "./Bar.svelte";
  import LargeBar from "./LargeBar.svelte";

  const bars = Array.from(" ".repeat(27));
  const animations = [];
  let container;

  let shouldPulse = false;
  let completed = false;
  let mobile = false;
  let windowSizeObj = {};
  function handleResize() {
    mobile = window.matchMedia("(max-width: 950px)").matches;
  }
  onMount(() => {
    mobile = window.matchMedia("(max-width: 950px)").matches;
    windowSizeObj["lg"] = window.matchMedia("(max-width: 1200px)");

    windowSizeObj["sm"] = window.matchMedia("(max-width: 600px)");
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    if (shouldAnimate) {
      gsap.to(container, {
        height: "600px",
        duration: 5,
      });
    }
  });
</script>

<div bind:this={container} class="bar-container">
  {#each bars as bar, i}
    <Bar index={i} {bar} />
  {/each}

  {#each largeBarsArr as bar, i}
    <LargeBar
      index={i}
      {mobile}
      {windowSizeObj}
      on:stopPulse={() => {
        shouldPulse = false;
      }}
      on:startPulse={() => {
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
    height: 600px;
    z-index: 3;
    display: flex;
    gap: 20px;
    width: 100%;
    max-width: 1700px;
    align-items: center;
    justify-content: center;

    position: relative;
    @media screen and (max-width: 950px) {
      justify-content: space-around;
      position: relative;
      height: 50vh;
    }
    @media screen and (max-width: 1078px) {
      justify-content: space-around;
      position: relative;
      height: 450px;
    }
  }
</style>
