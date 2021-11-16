<script>
  import gsap from "gsap";
  import { onMount } from "svelte";
  import {
    introAnimationStore,
    shouldAnimate,
  } from "./../../animationController.js";
  import { lgBarStore } from "./store.js";

  let bar;
  export let index;
  export let target;
  export let barInfo;
  let label;
  let marquee;

  onMount(() => {
    marquee = document.querySelector(".marquee-container-main");

    if (barInfo) {
      let animMobile = gsap.timeline({
        paused: true,
      });
      let animDesktop = gsap.timeline({
        paused: true,
      });
      animMobile.to(marquee, {
        width: "100vw",
        top: 0,
        duration: 0.4,
        height: "100vh",
        left: 0,
      });

      animDesktop.to(marquee, {
        width: "100vw",
        top: 0,
        duration: 0.4,
        height: "100vh",
        left: 0,
      });
      lgBarStore.init(index, animMobile, animDesktop);
    }
  });
  const getCenter = (ele) => {
    let positions = {};

    const elementPosition = ele.getBoundingClientRect();
    const marqueePosition = marquee.getBoundingClientRect();

    if (ele) {
      positions["x"] =
        (elementPosition.left + elementPosition.right) / 2 -
        marqueePosition.width / 2;
      positions["y"] =
        (elementPosition.top + elementPosition.bottom) / 2 -
        marqueePosition.width / 2;

      return positions;
    }
  };

  function expandMarquee(bar, size) {
    const center = getCenter(bar);
    lgBarStore.showMarquee(index, size, center);
  }
</script>

{#if target}
  <div class="bar-wrapper">
    <div
      on:click={(e) => {
        lgBarStore.setPageContent(index);

        lgBarStore.pageContentToggle(true);
        expandMarquee(e.target, "desktop");
      }}
      class={`target-sm target-${target.index}`}
      on:mouseenter={(e) => {
        gsap.to(e.target, {
          background: "transparent",
        });
        gsap.to(label, {
          opacity: 1,
        });
      }}
      on:mouseleave={(e) => {
        gsap.to(e.target, {
          background: "white",
        });
        gsap.to(label, {
          opacity: 0,
        });
      }}
      bind:this={bar}
    />
    <div bind:this={label} class="main-label-container">
      <p>{barInfo.label}</p>
    </div>
  </div>
  <div
    on:click={(e) => {
      expandMarquee(e.target, "mobile");
      e.stopPropagation();
    }}
    class="mobile-container"
  >
    <div class="mobile-bar-container" />
    <div class="label-container">
      <p>{barInfo.label}</p>
    </div>
  </div>
{:else}
  <div bind:this={bar} class={`bar-container ${"bar-sm"} `} />
{/if}

<style lang="scss">
  .target-sm {
    opacity: 0;
    z-index: 5;
    height: 100%;
    width: 100%;
    background-color: white;
    position: relative;
  }
  .mobile-container {
    display: none;
    @media screen and (max-width: 780px) {
      display: flex;
      height: 100%;
      width: 100%;

      .mobile-bar-container {
        height: 100%;
        width: 100%;
        position: relative;
        opacity: 1;
        background-color: white;
      }
      .label-container {
        opacity: 1;
        position: relative;
        font-size: 2em;
        font-family: unisansB;
        writing-mode: vertical-rl;
        text-orientation: sideways;
        top: auto !important;
        @media screen and (max-width: 550px) {
          font-size: 1.5em;
        }
      }
    }
  }
  .main-label-container {
    text-transform: uppercase;
    position: absolute;
    opacity: 0;
    font-size: 1.4em;
    text-align: left;
    color: white;
    top: 0;
    font-family: unisansB;
    writing-mode: vertical-rl;
    text-orientation: sideways;
  }
  .bar-wrapper {
    height: 100%;
    width: 100%;
    width: 40px;
    cursor: pointer;
    @media screen and (max-width: 780px) {
      display: none;
    }
  }
  .bar-container {
    opacity: 0;
    pointer-events: none;
    overflow: hidden;
    height: 100%;

    background-color: white;
    width: 20px;

    &:nth-child(2n + 1) {
      width: 10px;
    }
    @media screen and (max-width: 780px) {
      display: none;
    }
  }
</style>
