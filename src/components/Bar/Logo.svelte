<script>
  import gsap from "gsap";
  import { onMount } from "svelte";
  import { shouldAnimate } from "./../../animationController.js";
  import { largeBarObj, largeBarsArr } from "./animationObj";
  import Bar from "./SmBar.svelte";
  import LargeBar from "./LargeBar.svelte";
  import BarMask from "./BarMask.svelte";

  const bars = Array.from(" ".repeat(27));
  const targets = [
    {
      index: 5,
    },
    {
      index: 11,
    },
    { index: 17 },
    {
      index: 23,
    },
  ];
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
    <Bar
      barInfo={largeBarObj[i]}
      target={targets.find((idx) => {
        return i === idx.index;
      })}
      index={i}
      {bar}
    />
  {/each}

  {#each largeBarsArr as bar, i}
    <!-- <LargeBar
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
    /> -->

    <BarMask barIndex={targets[i]} />
  {/each}
</div>

<style lang="scss">
  .bar-container {
    z-index: 3;
    display: flex;
    gap: 20px;
    width: 100%;

    max-width: 1700px;
    aspect-ratio: 1.4;
    align-items: center;
    justify-content: space-around;

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
  .bar-mask-container {
    display: flex;
    gap: 40px;
    align-items: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30px;
    position: fixed;

    width: 100%;
  }
</style>
