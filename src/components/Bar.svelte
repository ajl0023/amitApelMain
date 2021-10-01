<script>
  import { Motion } from "svelte-motion";
  import main1 from "../images/home/1.png";
  import main2 from "../images/home/2.png";
  import main3 from "../images/home/3.jpg";
  import main4 from "../images/home/4.png";

  export let index;

  let shouldExpand = true;
  let shouldShowLabels = false;
  let imageVisible = true;

  const initialLarge = {
    3: {
      defaultPos: {
        left: "0px",
      },
      imagePos: {
        0: "0%",
        1: "0%",
      },
      img: main1,
      position: {
        left: "10.9%",

        top: "13.8%",

        width: "2.7%",
      },
    },
    17: {
      img: main2,
      imagePos: {
        0: "44%",
        1: "20%",
      },
      defaultPos: {
        left: "22.5%",
      },
      position: {
        left: "59.5%",

        top: "13.8%",

        width: "1.1%",
      },
    },
    23: {
      img: main3,
      imagePos: {
        0: "44%",
        1: "20%",
      },
      defaultPos: {
        left: "67.5%",
      },
      position: {
        left: "75.1%",
        top: "13.8%",

        width: "2.7%",
      },
    },
    28: {
      img: main4,
      imagePos: {
        0: "44%",
        1: "20%",
      },
      defaultPos: {
        left: "90%",
        right: "0",
      },
      position: {
        left: "94.4%",
        top: "13.8%",

        width: "2.9%",
      },
    },
  };
  let large = initialLarge[index];
  let initial = "1";
  let hoveredOut = 6;
  let currAnimation = "2";
  let variantSmall = {
    2: {
      rotateX: 0,
      opacity: 1,
      transition: { duration: hoveredOut, delay: 2.0 },
    },
    fullScreen: {
      width: "100vw",
      height: "70vh",
      left: 0,
      right: 0,
      scale: 1,
      rotateX: 0,
      zIndex: 2,
      position: "fixed",
    },
  };
  let variantLarge = {
    2: () => ({
      left: initialLarge[index].position.left,
      right: initialLarge[index].position.right,
      scale: 1,
      top: initialLarge[index].position.top,
      width: initialLarge[index].position.width,

      height: "62%",

      transition: { duration: hoveredOut, delay: 0.5 },
    }),
    fullScreen: {
      width: "100vw",
      height: "70vh",
      left: 0,
      right: 0,
      scale: 1,
      rotateX: 0,
      zIndex: 2,
      position: "fixed",
    },
  };

  const expand = (e) => {
    initial = "2";
    currAnimation = "fullScreen";

    shouldExpand = false;
  };
</script>

<Motion
  onAnimationComplete={(name) => {
    if (name === "2") {
      imageVisible = false;
      shouldShowLabels = true;
    }
  }}
  animate={currAnimation}
  variants={large ? variantLarge : variantSmall}
  onHoverStart={() => {
    hoveredOut = 0.2;
  }}
  let:motion
  ><div
    use:motion
    style={large
      ? `top:0;height:100%;left:${initialLarge[index].defaultPos.left}; opacity:1; width:10%; height:100%`
      : "opacity:0"}
    on:click={expand}
    class="{large ? 'large-bar' : 'small-bar'} single-bar-container"
  >
    {#if large}
      <Motion
        transition={{
          duration: 2,
          delay: 2,
        }}
        animate={{
          opacity: 0,
        }}
        let:motion
        ><img
          src={initialLarge[index].img}
          use:motion
          style={`opacity:1`}
          class="cover-image"
          alt=""
        />
      </Motion>
    {/if}
    <!-- <div class="close-main" /> -->
    <!-- <li
      style=" display:{shouldShowLabels ? 'block' : 'none'}"
      class="nav-label"
    /> -->
  </div>
</Motion>

<style lang="scss">
  .small-bar {
    position: absolute;
  }
  .cover-image {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
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

  .single-bar-container {
    z-index: 1;
    overflow: hidden;
    position: absolute;
    background-color: white;

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
      // left: 10.9%;

      top: 13.8%;
      height: 62%;
      width: 2.7%;
    }

    &:nth-child(5) {
      left: 14.3%;
      top: 13.8%;
      height: 62%;
      // width: 2.7%;
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
      // left: 59.5%;

      top: 13.8%;
      height: 62%;
      width: 1.1%;
    }
    &:nth-child(18) {
      // left: 61.3%;
      top: 13.8%;
      height: 62%;
      left: 20%;
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
</style>
