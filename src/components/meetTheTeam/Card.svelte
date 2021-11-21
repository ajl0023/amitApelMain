<script>
  import { cardStore, cardImages } from "./cardStore.js";
  import { DragGesture } from "@use-gesture/vanilla";
  import { onMount, onDestroy } from "svelte";
  import { spring, tweened } from "svelte/motion";
  import { distance, distMetric } from "../Marquee/utils.js";
  import gsap from "gsap";
  export let index;

  export let rotate;
  export let image;
  export let stack;
  export let outline;
  let ele;

  let exited;

  let rotateZ = tweened(rotate, {
    duration: 150,
  });

  const springCard = spring(0, {
    duration: 400,
    delay: 0,
  });

  const scaleHover = tweened(1, {
    duration: 200,
  });
  function exitCard() {
    const outLinePosition = outline.getBoundingClientRect();
    const stackPosition = stack.getBoundingClientRect();
    const distanceRes = distance(
      outLinePosition.x,
      stackPosition.x,
      outLinePosition.y,
      stackPosition.y
    );

    springCard.set(-distanceRes);
  }
  function rePositionExited() {
    if (exited) {
      exitCard();
    }
  }

  onMount(() => {
    gsap.set(ele, {
      rotateZ: $rotateZ,
    });
    cardStore.initEles({ ele, index });

    window.addEventListener("resize", rePositionExited);
    new DragGesture(
      ele,
      ({
        event,

        tap,
        direction,
        movement,

        active,
        swipe,
      }) => {
        event.preventDefault();

        springCard.set(movement[0]);

        if (tap && !exited) {
          // rotateY.update((s) => {
          //   if (s === 0) {
          //     return 180;
          //   } else {
          //     return 0;
          //   }
          // });
        }
        if (exited && tap) {
          cardStore.returnCard(index);
        }
        if (swipe[0] === -1 && direction[0] < 0) {
          exitCard();
          cardStore.exit(index);
          scaleHover.set(1);
          exited = true;
        } else if (!active) {
          springCard.set(0);

          exited = false;
        }
      },
      {
        // bounds: { left: "-500", right: 20, top: 0, bottom: 0 },
        eventOptions: { capture: false, passive: false },
        filterTaps: true,

        // swipe: {
        //   distance: 10,
        //   velocity: 0.1,
        // },
      }
    );
  });

  $: {
    if ($cardStore.shouldReturn) {
      setTimeout(() => {
        exited = false;
        springCard.set(0);
      }, 1000 + (5 - index) * 100);
    }
  }
  springCard.subscribe((v) => {
    gsap.set(ele, {
      x: v,
    });
  });
  let currentZ;
  let cardStackPos;
  $: {
    currentZ = $cardStore.zIndex.findIndex((z) => {
      return z === index;
    });
    cardStackPos = $cardStore.cards.findIndex((z) => {
      return z === index;
    });
    if (exited && ele && currentZ >= 0) {
      gsap.set(ele, { zIndex: currentZ });
    } else {
      gsap.set(ele, { zIndex: 5 - cardStackPos });
    }
  }
  $: {
    gsap.set(ele, { scale: $scaleHover });
  }
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  on:mouseenter={(e) => {
    if (!exited) {
      scaleHover.set(1.1);
    }
  }}
  on:mouseout={() => {
    scaleHover.set(1);
  }}
  bind:this={ele}
  draggable="false"
  class="card-container"
>
  <div draggable="false" class="image-container front-container">
    <img
      draggable="false"
      on:dragstart={(e) => {
        e.preventDefault();
      }}
      src={image["front"]}
      alt=""
    />
  </div>
  <div draggable="false" class="image-container back-container">
    <img
      on:dragstart={(e) => {
        e.preventDefault();
      }}
      draggable="false"
      src={image["back"]}
      alt=""
    />
  </div>
</div>

<style lang="scss">
  .test {
    display: none;
  }
  .card-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    will-change: transform;
    touch-action: none;
    box-shadow: 0 12.5px 100px -10px rgb(50 50 73 / 20%),
      0 10px 10px -10px rgb(50 50 73 / 20%);

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    @media screen and (max-width: 510px) {
      width: 200px;
      height: 350px;
    }
  }
  .front-container {
    position: absolute;
  }
  .image-container {
    overflow: hidden;

    border-radius: 10px;
    backface-visibility: hidden;

    height: 100%;
  }
  img {
    height: 100%;
    width: 100%;
  }
  .back-container {
    content: "";
    position: absolute;
    display: block;
    width: 100%;
    transform: rotateY(180deg);
    @media screen and (max-width: 510px) {
      width: 200px;
      height: 350px;
    }
  }
</style>
