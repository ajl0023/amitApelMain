<script>
  import gsap from "gsap";
  import { onMount } from "svelte";
  import { shouldAnimate } from "./../../animationController";
  import { largeBarObj, largeBarsArr } from "./animationObj";
  import BarPage from "./BarPage.svelte";
  import LargeBar from "./LargeBar.svelte";
  import BarMask from "./BarMask.svelte";
  import UpcReset from "./UpcReset.svelte";
  import "./logo.scss";
  import UpcDigit from "./UpcDigit.svelte";
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

  onMount(() => {
    const containers = document.querySelectorAll(".upc-reset");
  });
  const upcDigits1 = [
    { val: 0 },
    { val: 0 },
    { val: 1 },
    { val: 3, index: 0 },
    { val: 2 },
    { val: 3, index: 1 },
  ];
  const upcDigits2 = [
    { val: 1 },
    { val: 3, index: 2 },
    { val: 9 },
    { val: 8 },
    { val: 3, index: 3 },
    { val: 0 },
  ];
</script>

<div class="container">
  <div class="logo-container">
    <div class="barcode">
      <UpcReset />

      {#each upcDigits1 as dig}
        <UpcDigit data-val={dig.val} index={dig.index} target={dig.val === 3} />
      {/each}

      <UpcReset />
      {#each upcDigits2 as dig}
        <UpcDigit data-val={dig.val} index={dig.index} target={dig.val === 3} />
      {/each}

      <UpcReset />
    </div>
  </div>
</div>
<BarMask index={0} />
<BarMask index={1} />
<BarMask index={2} />
<BarMask index={3} />

<style lang="scss">
  .container {
    z-index: 1;
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    overflow: hidden;
    position: relative;
  }
  .logo-container {
    padding-top: (33% / 10) * 10;
    width: 100%;
    @media screen and (max-width: 650px) {
      display: flex;
      justify-content: space-evenly;
      padding-top: (85% / 10) * 10;
    }
  }
  .barcode {
  }
</style>
