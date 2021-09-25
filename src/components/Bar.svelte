<script>
  import { onMount } from "svelte";

  import { spring, tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { Motion, useMotionValue } from "svelte-motion";
  export let index;

  let shouldExpand = true;
  let shouldShowLabels = false;
  const initialLarge = [3, 28];

  let hoveredOut = 2;
  let animationArr = ["2"];
  const expandWidth = useMotionValue(0);
  const expand = (e) => {
    expandWidth.set(100);
    animationArr.push("fullScreen");
    console.log(animationArr);
    shouldExpand = false;
  };
</script>

<Motion
  whileHover={shouldExpand ? { scale: 1.2 } : null}
  onAnimationComplete={(name) => {
    if (name === "2") {
      shouldShowLabels = true;
    }
  }}
  variants={initialLarge.includes(index)
    ? {
        1: {
          scale: 1.8,
        },
        2: {
          scale: 1,
          transition: { duration: hoveredOut, repeat: 0 },
        },
        fullScreen: {
          width: "100vw",
          height: "70vh",
          left: 0,

          position: "fixed",
        },
      }
    : {
        1: {
          rotateX: index + 50 * (index + 1),
        },
        2: {
          rotateX: 0,
          transition: { duration: hoveredOut, repeat: 0 },
        },
        fullScreen: {
          width: "100vw",
          height: "70vh",
          left: 0,
          right: 0,

          position: "fixed",
        },
      }}
  initial="1"
  onHoverStart={() => {
    hoveredOut = 0.2;
  }}
  animate={animationArr}
  let:motion
  ><div use:motion class="single-bar-container">
    <div on:click={expand} class="bar">1</div>
    <li style="display:{shouldShowLabels ? 'block' : 'none'}" class="nav-label">
      asdfasdfdf
    </li>
  </div>
</Motion>

<style lang="scss">
  .single-bar-container {
    width: 100%;
  }
  .nav-label {
    display: none;
    position: absolute;
    bottom: -20px;
    color: white;
    transform: rotateZ(90deg) translateY(-50%);
    transform-origin: 0 50%;
    left: 0;

    list-style: none;
  }
  .single-bar-container {
    z-index: 5;
    background-color: white;
    position: absolute;

    &:nth-child(1) {
      left: 2%;
      top: 13.8%;
      height: 62%;
      width: 1%;
    }
    &:nth-child(2) {
      left: 3.6%;
      top: 13.8%;
      height: 62%;
      width: 0.9%;
    }
    &:nth-child(3) {
      left: 6.9%;
      top: 13.9%;
      height: 62%;
      width: 2%;
    }
    &:nth-child(4) {
      left: 10.9%;
      top: 13.8%;
      height: 62%;
      width: 2.7%;
      transform: scale(1.8);
    }

    &:nth-child(5) {
      left: 14.3%;
      top: 13.8%;
      height: 62%;
      width: 2.7%;
    }
    &:nth-child(6) {
      left: 17.8%;
      top: 13.8%;
      height: 62%;
      width: 1.5%;
    }
    &:nth-child(7) {
      left: 20%;
      top: 13.8%;
      height: 62%;
      width: 1.1%;
    }
    &:nth-child(8) {
      left: 23.1%;
      top: 13.8%;
      height: 62%;
      width: 1.9%;
    }
    &:nth-child(9) {
      left: 25.7%;
      top: 13.8%;
      height: 62%;
      width: 1%;
    }
    &:nth-child(10) {
      left: 28.8%;
      top: 13.8%;
      height: 62%;
      width: 1%;
    }
    &:nth-child(11) {
      left: 32%;
      top: 13.8%;
      height: 62%;
      width: 1.9%;
    }
    &:nth-child(12) {
      left: 34.6%;
      top: 13.8%;
      height: 62%;
      width: 2.5%;
    }
    &:nth-child(13) {
      left: 46.6%;
      top: 13.8%;
      height: 62%;
      width: 1%;
    }
    &:nth-child(14) {
      left: 49.8%;
      top: 13.8%;
      height: 62%;
      width: 1.9%;
    }
    &:nth-child(15) {
      left: 54%;
      top: 13.8%;
      height: 62%;
      width: 0.9%;
    }
    &:nth-child(16) {
      left: 55.6%;
      top: 13.8%;
      height: 62%;
      width: 1.8%;
    }
    &:nth-child(17) {
      left: 59.5%;
      top: 13.8%;
      height: 62%;
      width: 1.1%;
    }
    &:nth-child(18) {
      left: 61.3%;
      top: 13.8%;
      height: 62%;
      width: 2.5%;
    }
    &:nth-child(19) {
      left: 91.3%;
      top: 13.8%;
      height: 62%;
      width: 1.1%;
    }

    &:nth-child(20) {
      left: 64.5%;
      top: 13.8%;
      height: 62%;
      width: 1%;
    }
    &:nth-child(21) {
      left: 66.4%;
      top: 13.8%;
      height: 62%;
      width: 0.9%;
    }
    &:nth-child(22) {
      left: 69.4%;
      top: 13.8%;
      height: 62%;
      width: 1.9%;
    }
    &:nth-child(23) {
      left: 73.5%;
      top: 13.8%;
      height: 62%;
      width: 0.9%;
    }
    &:nth-child(24) {
      left: 75.1%;
      top: 13.8%;
      height: 62%;
      width: 2.7%;
    }
    &:nth-child(25) {
      left: 79.9%;
      top: 13.8%;
      height: 62%;
      width: 1.7%;
    }
    &:nth-child(26) {
      left: 82.5%;
      top: 13.8%;
      height: 62%;
      width: 0.8%;
    }
    &:nth-child(27) {
      left: 85.5%;
      top: 13.8%;
      height: 62%;
      width: 1.2%;
    }
    &:nth-child(28) {
      left: 88.9%;
      top: 13.8%;
      height: 62%;
      width: 1.7%;
    }
    &:nth-child(29) {
      left: 94.4%;
      top: 13.8%;
      height: 62%;
      width: 2.9%;
    }
    &:nth-child(30) {
      left: 97.9%;
      top: 13.8%;
      height: 62%;
      width: 1.7%;
    }
  }
  .full-screen {
    position: fixed !important;
    left: 0 !important;
    width: 100vw !important;
  }
</style>
