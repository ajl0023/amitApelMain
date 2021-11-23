<script>
  import { DragGesture } from "@use-gesture/vanilla";
  import gsap from "gsap";
  import { onMount } from "svelte";
  import { spring, tweened } from "svelte/motion";
  import { derived } from "svelte/store";
  import { distance } from "../Marquee/utils.js";
  import { cardStore } from "./cardStore.js";
  export let index;

  export let rotate;
  export let image;
  export let stack;
  export let outline;
  $: ({ shouldReturn, cardToExit } = $cardStore);

  let ele;

  let exited;
  let scaleHover = tweened(1, {
    duration: 150,
  });
  const rotateZ = tweened(rotate, {
    duration: 150,
  });
  const zAxis = tweened((5 - index) * 20, {
    duration: 300,
  });

  const springCard = spring(0, {
    stiffness: 0.1,
    damping: 0.5,
  });

  const derivedS = derived([springCard, scaleHover, zAxis], ($store) => {
    return { x: $store[0], z: $store[2], scale: $store[1] };
  });
  $: if (cardToExit === index && !shouldReturn) {
    exitCard();
  }

  function returnAll() {
    springCard.stiffness = 0.1;
    springCard.damping = 1;
    exited = false;

    springCard.set(0).then(() => {
      cardStore.reenable(index);
    });
    zAxis.set((5 - index) * 20);
  }
  $: if (shouldReturn) {
    setTimeout(() => {
      returnAll();
    }, 1000 + (5 - index) * 100);
  }

  function exitCard() {
    exited = true;

    cardStore.exit(index);

    const outLinePosition = outline.getBoundingClientRect();
    const stackPosition = stack.getBoundingClientRect();
    const distanceRes = distance(
      outLinePosition.x,
      stackPosition.x,
      outLinePosition.y,
      stackPosition.y
    );

    springCard.set(-distanceRes);
    zAxis.set(0);
  }

  onMount(() => {
    new DragGesture(
      ele,
      ({ event, tap, direction, movement, active, swipe }) => {
        event.preventDefault();

        if (!shouldReturn) {
          if (!exited) {
            springCard.set(movement[0]);
            if (swipe[0] === -1 && direction[0] < 0) {
              exitCard();
            } else if (!active) {
              springCard.set(0);
            }
          } else if (exited && tap) {
            exited = false;
            cardStore.returnCard(index);
            zAxis
              .set((5 - index) * 20, {
                duration: 10,
              })
              .then(() => {
                springCard.set(0);
              });
          }
        }
      },
      {
        eventOptions: { capture: false, passive: false },
        filterTaps: true,
      }
    );
    gsap.set(ele, {
      z: $zAxis,
      rotateZ: $rotateZ,
      y: "-100vh",
    });
  });

  derivedS.subscribe((v) => {
    gsap.set(ele, {
      x: v.x,
      z: v.z,
      scale: v.scale,
    });
  });
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  on:mouseenter={() => {
    if (!exited && !shouldReturn) {
      scaleHover.set(1.1);
    }
  }}
  on:mouseout={() => {
    scaleHover.set(1);
  }}
  bind:this={ele}
  draggable="false"
  class="card-container meet-the-team-card"
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
    z-index: 1;
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
