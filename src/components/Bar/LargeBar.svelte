<script>
  import { loadedVideos } from "./store.js";
  import { browser } from "$app/env";
  import gsap from "gsap";
  import { afterUpdate, createEventDispatcher, onMount } from "svelte";
  import Marque from "../Marquee/Marque.svelte";
  import { shouldAnimate } from "./../../animationController.js";

  export let shouldPulse;
  export let barObj;
  export let completed;

  let pageOpened = false;
  let bar;
  let img;
  const dispatch = createEventDispatcher();
  let tl;
  let maintl;
  let animated = true;
  let barInner;
  let label;
  afterUpdate(() => {
    if (shouldAnimate && $loadedVideos.length === 4 && animated) {
      maintl = gsap.timeline({ delay: barObj.delay });

      maintl
        .to(bar, {
          opacity: 1,
          duration: 3,
        })
        .to(bar, {
          scale: 1,
          duration: 3,

          ...barObj.position,
          ease: "power1.in",
        })
        .to(
          barInner,
          {
            backgroundColor: "white",
          },
          ">-0.8"
        )
        .to(
          img,
          {
            opacity: 0,
            display: "none",
          },
          ">-0.4"
        )

        .then(() => {
          dispatch("complete");
          animated = false;
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
        tl.to(barInner, {
          opacity: 0,
          duration: 1,
        }).to(barInner, {
          opacity: 1,
          duration: 1,
        });
        tl.play();
      } else {
        tl.pause();
        gsap.to(barInner, {
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
  style="transform:scale(0.8)"
  bind:this={bar}
  class:should-animate={shouldAnimate}
  class="bar-wrapper bar-{barObj.index} {pageOpened ? 'opened' : ''}"
>
  <div bind:this={label} class="main-label-container">
    <p>{barObj.label}</p>
  </div>
  <div
    bind:this={barInner}
    on:mouseenter={() => {
      if (!pageOpened) {
        gsap.to(label, {
          opacity: 1,
        });
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
        gsap.to(label, {
          opacity: 0,
        });
      }
    }}
    on:click={(e) => {
      pageOpened = true;
      dispatch("stopPulse");
      e.stopPropagation();
      gsap.to(bar, {
        left: -bar.offsetParent.offsetLeft,
        width: "100vw",
        height: "100vh",
        duration: 0.5,
        scale: 1,
        top: -bar.offsetParent.offsetTop,
      });
    }}
    class="bar-container"
  >
    {#if pageOpened}
      <Marque
        on:closePageContent={(e) => {
          dispatch("startPulse");
          pageOpened = false;
          gsap.to(bar, {
            height: "40vh",
            left: barObj.position.left,
            top: 0,
            width: barObj.position.width,
          });
        }}
        defaultPosition={barObj.position}
        index={barObj.index}
        categories={barObj.categories}
      />
      <div />
    {/if}
    <video
      on:loadeddata={() => {
        loadedVideos.update((s) => {
          s.push("");
          return s;
        });
      }}
      autoplay
      muted
      bind:this={img}
      class="cover-image"
      src={barObj.img}
    />
  </div>
</div>

<style lang="scss">
  .bar-container {
    width: 100%;

    position: relative;
    height: 100%;

    overflow: hidden;
  }
  .main-label-container {
    text-transform: uppercase;
    position: absolute;
    opacity: 0;
    font-size: 1.4em;
    text-align: center;
    top: 0;
  }
  .cover-image {
    height: 100%;
    object-position: center center;
    width: 100%;

    object-fit: cover;
  }
  .should-animate {
    opacity: 0;
    pointer-events: none;
  }
  .bar-wrapper {
    width: 20%;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    z-index: 1;

    background-color: transparent;
    height: 100%;
    position: absolute;
  }
  .opened {
    z-index: 3;
  }
  .bar-3 {
    .main-label-container {
      top: -70px;
    }
    left: 0;
  }
  .bar-17 {
    left: 20vw;
    .main-label-container {
      top: -25px;
    }
  }
  .bar-23 {
    right: 20vw;
    .main-label-container {
      top: -25px;
    }
  }
  .bar-28 {
    right: 0;
    .main-label-container {
      top: -25px;
    }
  }
</style>
