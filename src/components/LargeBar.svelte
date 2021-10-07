<script>
  import { afterUpdate, createEventDispatcher, onMount } from "svelte";

  import { Motion, useAnimation } from "svelte-motion";

  import PageContent from "./PageContent.svelte";
  import { largeBarObj } from "../animationObj";
  import gsap from "gsap";
  import { amp, browser, dev, mode, prerendering } from "$app/env";

  export let index;
  export let animations;
  export let shouldPulse;
  export let barObj;
  let pageOpened = false;
  let bar;
  let img;
  const dispatch = createEventDispatcher();
  let tl;
  onMount(async () => {
    gsap
      .to(bar, {
        ...barObj.position,
        duration: 6,
        scale: 1,
        opacity: 1,
        delay: barObj.delay,
        id: "initial",
      })
      .then(() => {
        gsap
          .to(img, {
            opacity: 0,
          })
          .then(() => {
            bar.style.pointerEvents = "auto";
            dispatch("complete", {
              text: "helllo",
            });
          });
      });
    tl = gsap.timeline({
      repeat: -1,
      paused: true,
    });
  });

  $: {
    if (tl) {
      if (shouldPulse && browser) {
        tl.to(bar, {
          opacity: 0,
          duration: 1,
        }).to(bar, {
          opacity: 1,
          duration: 1,
        });
        tl.play();
      } else {
        tl.pause();
        gsap.to(bar, {
          opacity: 1,
        });
      }
    }
  }
</script>

<div
  on:mouseenter={() => {
    if (!pageOpened) {
      gsap.to(bar, {
        scale: 1.2,
      });
    }
  }}
  on:mouseleave={() => {
    if (!pageOpened) {
      gsap.to(bar, {
        scale: 1,
      });
    }
  }}
  on:click={() => {
    pageOpened = true;
    dispatch("stopPulse");
    gsap.to(bar, {
      left: -bar.offsetParent.offsetLeft,
      width: "100vw",
      height: "100vh",
      duration: 0.5,
      scale: 1,
      top: -bar.offsetParent.offsetTop,
    });
  }}
  style="transform:scale(0.6)"
  bind:this={bar}
  class="{pageOpened ? 'opened' : ''} bar-container bar-{barObj.index}"
>
  {#if pageOpened}
    <PageContent />
    <div
      class="close-main"
      on:click={(e) => {
        e.stopPropagation();
        dispatch("startPulse");
        pageOpened = false;
        gsap.to(bar, {
          height: "40vh",

          left: barObj.position.left,
          top: 0,

          width: barObj.position.width,
        });
      }}
    />
  {/if}
  <img bind:this={img} src={barObj.img} class="cover-image" alt="" />
</div>

<style lang="scss">
  .cover-image {
    height: 100%;
    object-position: center center;
    width: 100%;

    object-fit: cover;
  }

  .bar-container {
    opacity: 0;
    width: 20%;
    top: 0;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
    height: 100%;
    position: absolute;

    background-color: white;
  }
  .opened {
    z-index: 3;
  }
  .bar-3 {
    left: 0;
  }
  .bar-17 {
    left: 20vw;
  }
  .bar-23 {
    right: 20vw;
  }
  .bar-28 {
    right: 0;
  }
</style>
