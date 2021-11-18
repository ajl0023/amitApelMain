<script>
  import gsap from "gsap";
  import { onMount } from "svelte";
  import { largeBarObj } from "./animationObj";

  import BarMask from "./BarMask.svelte";
  import { lgBarStore } from "./store";
  let marquee;
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
    lgBarStore.init($$props.index, animMobile, animDesktop);
  });
  function expandMarquee(bar, size) {
    const center = getCenter(bar);
    lgBarStore.showMarquee($$props.index, size, center);
  }
  let label;
  const barInfo = largeBarObj[$$props.index];
</script>

<div class="bar bar-wrapper ">
  <div class="inner-bar">
    <div
      class="target-{$$props.index} target-cover"
      on:click={(e) => {
        lgBarStore.setPageContent($$props.index);

        lgBarStore.pageContentToggle(true);
        expandMarquee(e.target, "desktop");
      }}
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
</div>

<style lang="scss">
  .target-cover {
    width: 100%;
    height: 100%;
    background-color: white;
  }
  .mobile-container {
    display: none;
    @media screen and (max-width: 650px) {
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

        color: white;
        font-family: unisansB;
        writing-mode: vertical-rl;
        text-orientation: sideways;
        top: auto !important;
        p {
          font-size: 20px;
        }
      }
    }
  }
  .bar-wrapper {
    height: 100%;
    width: 100%;

    cursor: pointer;
    pointer-events: none;
    @media screen and (max-width: 650px) {
      pointer-events: auto;
    }
  }
  .inner-bar {
    width: 100%;
    height: 100%;
    @media screen and (max-width: 650px) {
      display: none;
    }
  }

  .main-label-container {
    text-transform: uppercase;
    position: absolute;
    opacity: 0;
    left: 0;
    text-align: left;
    color: white;
    top: 0;
    color: white;
    font-family: unisansB;
    writing-mode: vertical-rl;
    pointer-events: none;
    text-orientation: sideways;
    p {
      font-size: 50px;
    }
  }
  .wrapper {
    width: 100%;
    height: 100%;
  }
</style>
