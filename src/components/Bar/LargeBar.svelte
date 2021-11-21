<script>
  import gsap from "gsap";
  import { afterUpdate, createEventDispatcher, onMount } from "svelte";
  import { shouldAnimate } from "./../../animationController.js";
  import { lgBarStore, loadedVideos } from "./store.js";

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

  onMount(() => {
    gsap.to(mobileBar, {
      opacity: 1,
      delay: 1,
    });
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

<div bind:this={bar} class:should-animate={shouldAnimate} class="wrapper">
  <div
    class="bar-wrapper bar-{barObj.index}"
    class:mobile-bar={windowSizeObj["mobile"] && mobile}
  >
    <div
      bind:this={barInner}
      on:mouseenter={() => {
        // gsap.to(barInner, {
        //   opacity: 0,
        // });
      }}
      on:mouseleave={() => {}}
      on:click={(e) => {
        lgBarStore.setPageContent(barObj.index);
        expandMarquee(barInner, "desktop");
        lgBarStore.pageContentToggle(true);

        // lgBarStore.showMarqueeDesktop(index);
        dispatch("stopPulse");
        e.stopPropagation();
      }}
      class="bar-container-lg"
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

    <div />
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
  .bar-wrapper {
    z-index: 1;

    @media screen and (max-width: 950px) {
      display: none;
    }
    // position: absolute;
  }

  .wrapper {
    display: flex;
    flex-direction: row-reverse;
    width: 200px;
    height: 100%;
    top: 0;
    cursor: pointer;
    transform: scale(0.8);
    background-color: white;
    @media screen and (max-width: 950px) {
      flex: 25%;
      height: 100%;
      z-index: 1;
      position: relative;
    }
  }
  
  .inactive {
    display: none;
  }
  .bar-container-lg {
    width: 100%;
    opacity: 0;
    position: relative;
    height: 100%;

    overflow: hidden;
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
