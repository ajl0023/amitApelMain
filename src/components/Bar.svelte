<script>
  import { onMount } from "svelte";

  import { Motion } from "svelte-motion";

  import PageContent from "./PageContent.svelte";
  import { largeBarObj } from "../animationObj";
  export let index;
  let playAnimation = false;
  let pageOpened = false;
  let currAnimation = "largeBar";
  let shouldHover = true;
  let bar;
  let shouldShowCover = true;
  let large = largeBarObj[index];
  let animationDur = 3;
  let animationDelay = 0.5;
  const smallBarVariant = {
    visible: () => {
      return {
        transition: {
          delay: playAnimation ? 4.85 : 0,
        },
        opacity: 1,
      };
    },
  };
  const variants = {
    shrink: () => {
      return {
        scale: 1,

        opacity: 1,
        left: large.position.left,
        top: "0",

        width: large.position.width,
        transition: {
          delay: playAnimation ? animationDelay : 0,
          duration: playAnimation ? animationDur : 0,
        },
      };
    },
    largeBar: () => {
      return {
        scale: 1,
        opacity: 1,
        transition: {
          duration: playAnimation ? 2 : 0,
          delay: playAnimation ? large.delay : 0,

          ease: [0.01, 0.01, 0.01, 0.01],
        },
      };
    },
    fullPage: () => {
      return {
        scale: 1,
        zIndex: 3,
        opacity: 1,
        position: "fixed",

        width: "100vw",
        height: "100vh",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
      };
    },
  };
</script>

<Motion
  style={{
    scale: large ? 0.5 : 1,
  }}
  onHoverEnd={() => {
    animationDelay = 0;
    animationDur = 0.3;
  }}
  whileHover={{
    scale: shouldHover ? 1.3 : 1,

    transition: {
      duration: 0.3,
    },
  }}
  onAnimationComplete={(name) => {
    if (name === "largeBar") {
      currAnimation = "shrink";
    }
    if (name === "shrink") {
      bar.style.pointerEvents = "auto";
    }
  }}
  animate={large ? currAnimation : "visible"}
  variants={large ? variants : smallBarVariant}
  let:motion
  ><div
    on:click={(e) => {
      if (large) {
        shouldHover = false;
        pageOpened = true;
        currAnimation = "fullPage";
      }
    }}
    bind:this={bar}
    use:motion
    class="bar-container {!large ? 'small-bar' : 'large-bar'}"
  >
    {#if pageOpened}
      <PageContent />
    {/if}
    {#if large && shouldShowCover}
      <Motion
        let:motion
        variants={{
          visible: {},
          hidden: {
            opacity: 0,
            transition: {
              delay: 5,
            },
          },
        }}
        animate={"hidden"}
        ><img
          use:motion
          src={largeBarObj[index].img}
          class="cover-image"
          alt=""
        />
      </Motion>
    {/if}
    {#if pageOpened}
      <div
        class="close-main"
        on:click={(e) => {
          e.stopPropagation();

          pageOpened = false;
          shouldHover = true;

          currAnimation = "shrink";
        }}
      />
    {/if}
  </div></Motion
>

<style lang="scss">
  .cover-image {
    height: 100%;
    object-position: center center;
    width: 100%;

    object-fit: cover;
  }
  .close-main {
    height: 32px;
    max-height: 32px;
    max-width: 32px;
    min-height: 32px;
    min-width: 32px;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    width: 32px;

    &:after {
      background-color: black;
      content: "";
      display: block;
      right: 0;
      position: absolute;
      top: 50%;
      height: 2px;
      width: 50%;
      transform: translate(-50%) translateY(-50%) rotate(45deg);
      transform-origin: center center;
    }
    &::before {
      background-color: black;
      content: "";
      height: 50%;
      width: 2px;
      display: block;

      left: 50%;
      position: absolute;
      top: 50%;
      transform: translate(-50%) translateY(-50%) rotate(45deg);
      transform-origin: center center;
    }
  }

  .large-bar {
    width: 20%;
    opacity: 0;
    height: 100%;
  }
  .small-bar {
    opacity: 0;
  }
  .bar-container {
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
    height: 100%;
    position: absolute;
    background-color: white;

    &:nth-child(1) {
      left: 2%;
      top: 0%;

      width: 1%;
    }
    &:nth-child(2) {
      left: 3.6%;
      top: 0%;

      width: 0.9%;
    }
    &:nth-child(3) {
      left: 6.9%;
      top: 0%;

      width: 2%;
    }
    &:nth-child(4) {
      // left: 10.9%;
      left: 0;
      top: 0%;
    }

    &:nth-child(5) {
      left: 14.3%;
      top: 0%;

      // width: 2.7%;
    }
    &:nth-child(6) {
      left: 17.8%;
      top: 0%;

      width: 1.5%;
    }
    &:nth-child(7) {
      left: 20%;
      top: 0%;

      width: 1.1%;
    }
    &:nth-child(8) {
      left: 23.1%;
      top: 0%;

      width: 1.9%;
    }
    &:nth-child(9) {
      left: 25.7%;
      top: 0%;

      width: 1%;
    }
    &:nth-child(10) {
      left: 28.8%;
      top: 0%;

      width: 1%;
    }
    &:nth-child(11) {
      left: 32%;
      top: 0%;

      width: 1.9%;
    }
    &:nth-child(12) {
      left: 34.6%;
      top: 0%;

      width: 2.5%;
    }
    &:nth-child(13) {
      left: 46.6%;
      top: 0%;

      width: 1%;
    }
    &:nth-child(14) {
      left: 49.8%;
      top: 0%;

      width: 1.9%;
    }
    &:nth-child(15) {
      left: 54%;
      top: 0%;

      width: 0.9%;
    }
    &:nth-child(16) {
      left: 55.6%;
      top: 0%;

      width: 1.8%;
    }
    &:nth-child(17) {
      // left: 59.5%;

      top: 0%;

      width: 1.1%;
    }
    &:nth-child(18) {
      left: 20vw;
      top: 0%;
    }
    &:nth-child(19) {
      left: 91.3%;
      top: 0%;

      width: 1.1%;
    }

    &:nth-child(20) {
      left: 64.5%;
      top: 0%;

      width: 1%;
    }
    &:nth-child(21) {
      left: 66.4%;
      top: 0%;

      width: 0.9%;
    }
    &:nth-child(22) {
      left: 69.4%;
      top: 0%;

      width: 1.9%;
    }
    &:nth-child(23) {
      left: 73.5%;
      top: 0%;

      width: 0.9%;
    }
    &:nth-child(24) {
      right: 20vw;
      top: 0%;
    }
    &:nth-child(25) {
      left: 79.9%;
      top: 0%;

      width: 1.7%;
    }
    &:nth-child(26) {
      left: 82.5%;
      top: 0%;

      width: 0.8%;
    }
    &:nth-child(27) {
      left: 85.5%;
      top: 0%;

      width: 1.2%;
    }
    &:nth-child(28) {
      left: 88.9%;
      top: 0%;

      width: 1.7%;
    }
    &:nth-child(29) {
      right: 0;
      top: 0%;
    }
    &:nth-child(30) {
      left: 97.9%;
      top: 0%;

      width: 1.7%;
    }
  }
</style>
