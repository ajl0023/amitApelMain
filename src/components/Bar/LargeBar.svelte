<script>
  import { loadedVideos, lgBarStore } from "./store.js";
  import { browser } from "$app/env";
  import gsap from "gsap";
  import {
    afterUpdate,
    createEventDispatcher,
    onMount,
    onDestroy,
  } from "svelte";
  import Marque from "../Marquee/Marque.svelte";
  import { shouldAnimate } from "./../../animationController.js";

  export let shouldPulse;
  export let barObj;
  export let completed;
  export let windowSizeObj;
  export let mobile;
  export let index;
  const dispatch = createEventDispatcher();
  let mobileBar;

  let mobileBarCenter = {};
  let pageOpened = false;
  let bar;
  let img;

  let maintl;
  let animated = true;
  let barInner;
  let label;
  let marquee;
  let centerPosition;
  let pulseAnimation = gsap.timeline({ paused: true, repeat: -1 });
  function expandMarquee(bar, size) {
    centerPosition = getCenter(bar);

    lgBarStore.showMarquee(barObj.index, size, centerPosition);
  }
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

  onMount(() => {
    marquee = document.querySelector(".marquee-container-main");

    pulseAnimation
      .to(barInner, {
        opacity: 0,
        duration: 1,
      })
      .to(barInner, {
        opacity: 1,
        duration: 1,
      });
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
    lgBarStore.init(barObj.index, animMobile, animDesktop);
  });

  afterUpdate(() => {
    if (
      shouldAnimate &&
      $loadedVideos.length === 4 &&
      animated &&
      windowSizeObj
    ) {
      maintl = gsap.timeline({ delay: barObj.delay });

      maintl
        .to(bar, {
          opacity: 1,
          duration: 3,
        })
        .to(bar, {
          scale: 1,
          duration: 3,
          width: barObj.position.width,
          top: barObj.position.top,
          left: barObj.position.left,

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
    }
  });

  $: {
    if (completed) {
      pulseAnimation.play();
    }
  }
  $: {
    if (shouldPulse) {
      bar.style.pointerEvents = "auto";
    }
  }
</script>

<div class="wrapper">
  <div
    bind:this={bar}
    class:should-animate={shouldAnimate}
    class="bar-wrapper bar-{barObj.index} {pageOpened ? 'opened' : ''}"
    class:mobile-bar={windowSizeObj["mobile"] && mobile}
  >
    <div
      bind:this={label}
      class:inactive={pageOpened}
      class="main-label-container"
    >
      <p>{barObj.label}</p>
    </div>
    <div
      bind:this={barInner}
      on:mouseenter={() => {
        if (!pageOpened) {
          gsap.to(label, {
            opacity: 1,
          });
          pulseAnimation.pause();
          gsap.to(barInner, {
            scale: 1.2,
            opacity: 0,
          });
        }
      }}
      on:mouseleave={() => {
        if (!pageOpened) {
          pulseAnimation.resume();
          gsap.to(label, {
            opacity: 0,
          });
          gsap.to(barInner, {
            scale: 1,
            opacity: 1,
          });
        }
      }}
      on:click={(e) => {
        lgBarStore.setPageContent(barObj.index);
        expandMarquee(barInner, "desktop");
        lgBarStore.pageContentToggle(true);

        // lgBarStore.showMarqueeDesktop(index);
        dispatch("stopPulse");
        e.stopPropagation();
      }}
      class="bar-container"
    >
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
        class="cover-video"
        src={barObj.img}
      />
    </div>
  </div>
  <div class="marquee-container" />
  <div
    on:click={(e) => {
      expandMarquee(mobileBar, "mobile");
      e.stopPropagation();
    }}
    class="mobile-container"
  >
    <div bind:this={mobileBar} class="mobile-bar-container" />
    <div class="label-container">
      <p>{barObj.label}</p>
    </div>
  </div>
</div>

<style lang="scss">
  .center-element {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;

    visibility: hidden;
  }
  .hidden {
    visibility: hidden;
  }

  .wrapper {
    @media screen and (max-width: 950px) {
      flex: 25%;
      height: 100%;
      z-index: 1;
      position: relative;
    }
  }
  .mobile-container {
    display: none;
    @media screen and (max-width: 950px) {
      display: flex;
      height: 100%;
      width: 100%;

      .mobile-bar-container {
        height: 100%;
        width: 100%;
        position: relative;
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
  .inactive {
    display: none;
  }
  .bar-container {
    width: 100%;

    position: relative;
    height: 100%;

    overflow: hidden;
  }

  .main-label-container {
    text-transform: uppercase;

    opacity: 0;
    font-size: 1.4em;
    text-align: left;

    height: 100%;

    position: absolute;
    font-size: 2em;
    font-family: unisansB;
    writing-mode: vertical-rl;
    text-orientation: sideways;
  }
  .cover-video {
    height: 100%;
    &::-webkit-media-controls-panel {
      display: none !important;
      -webkit-appearance: none;
    }

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
    position: absolute;
    display: flex;
    flex-direction: row-reverse;
    z-index: 1;

    background-color: transparent;
    height: 100%;
    transform: scale(0.8);
    @media screen and (max-width: 950px) {
      display: none;
    }
    // position: absolute;
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
