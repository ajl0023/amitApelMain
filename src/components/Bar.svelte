<script>
  let shouldExpand = false;
  export let index;
  let hovered = false;
  const expand = (e) => {
    shouldExpand = !shouldExpand;
    hovered = false;
    e.target.onHover = "";
  };
</script>

<div
  class:sm={index !== 3 && index !== 4 && index !== 17 && index !== 30}
  class:lg={index === 3 || index === 4 || index === 17 || index === 30}
  class:hovered
  class:full-screen={shouldExpand}
  class="bar"
  on:mouseenter={(e) => {
    if (!shouldExpand) {
      hovered = true;
    }
  }}
  on:mouseleave={(e) => {
    hovered = false;
  }}
  on:click={expand}
/>

<style lang="scss">
  @keyframes openingLg {
    0% {
      transform: scale(1.5);
    }

    100% {
      transform: scale(1);
    }
  }
  @keyframes openingSm {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 50%;
    }
    100% {
      opacity: 100%;
    }
  }
  .lg {
    animation: openingLg 2s ease-in-out;
  }
  .sm {
    animation: openingSm 4s;
    animation-timing-function: cubic-bezier(0.5, 0.5, 1, 1);
  }
  .hovered {
    transform: translateY(-20px) scale(1.3);
  }
  .bar {
    z-index: 5;
    background-color: black;
    position: absolute;
    transition: cubic-bezier(0.075, 0.82, 0.165, 1) 1s;

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
    &:hover {
      content: none !important;
    }
  }
</style>
