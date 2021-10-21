<script>
  import { shouldAnimate } from "./../../animationController.js";
  import { browser } from "$app/env";
  import gsap from "gsap";
  import { createEventDispatcher, onMount } from "svelte";
  import Marque from "../Marquee/Marque.svelte";

  export let index;
  export let animations;
  export let shouldPulse;
  export let barObj;
  export let completed;
  let pageOpened = false;
  let bar;
  let img;
  const dispatch = createEventDispatcher();
  let tl;
  let maintl;
  onMount(async () => {
    console.log(index);
    if (shouldAnimate) {
      maintl = gsap.timeline({ delay: barObj.delay });

      maintl
        .to(bar, {
          scale: 1,
          duration: 5,
          opacity: 1,
          ...barObj.position,
          ease: "power1.in",
        })
        .to(
          bar,
          {
            backgroundColor: "white",
          },
          ">-0.5"
        )
        .to(
          img,
          {
            opacity: 0,
          },
          ">-0.5"
        )

        .then(() => {
          dispatch("complete");
        });

      tl = gsap.timeline({
        repeat: -1,
        paused: true,
      });
    }
  });

  $: {
    if (tl && completed) {
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
  $: {
    if (shouldPulse) {
      bar.style.pointerEvents = "auto";
    }
  }
</script>

<div
  on:mouseenter={(e) => {
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
  style="transform:scale(0.8)"
  bind:this={bar}
  class="{pageOpened ? 'opened' : ''} bar-container bar-{barObj.index}"
>
  {#if pageOpened}
    <Marque index={barObj.index} categories={barObj.categories} />
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
  <video autoplay muted bind:this={img} class="cover-image" src={barObj.img} />
</div>

<style lang="scss">
  .cover-image {
    height: 100%;
    object-position: center center;
    width: 100%;

    object-fit: cover;
  }

  .bar-container {
    opacity: 1;
    width: 20%;
    top: 0;
    z-index: 1;
    // pointer-events: none;
    overflow: hidden;
    height: 100%;
    position: absolute;
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
