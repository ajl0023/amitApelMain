<script>
  import { cardStore, cardImages } from "./cardStore.js";
  import { DragGesture } from "@use-gesture/vanilla";
  import { onMount, onDestroy } from "svelte";
  import { spring, tweened } from "svelte/motion";
  import { distance, distMetric } from "../Marquee/utils.js";
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
  let rotateY = tweened(-180, {
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
    window.addEventListener("resize", rePositionExited);
    new DragGesture(
      ele,
      ({
        event,
        down,
        tap,
        direction,
        movement,
        velocity,
        offset,
        active,
        swipe,
      }) => {
        event.preventDefault();

        springCard.set(movement[0]);
        if (tap && !exited) {
          rotateY.update((s) => {
            if (s === 0) {
              return 180;
            } else {
              return 0;
            }
          });
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
        eventOptions: { captsure: true, passive: false },
        filterTaps: true,

        // swipe: {
        //   distance: 10,
        //   velocity: 0.1,
        // },
      }
    );
  });
  onDestroy(() => {});
  let indexInStack;
  $: {
    indexInStack = $cardStore.cards.findIndex((f) => {
      return f === index;
    });

    if ($cardStore.shouldReturn) {
      setTimeout(() => {
        exited = false;
        springCard.set(0);
      }, 1000 + (5 - index) * 100);
    }
  }
  cardStore.subscribe((v) => {});
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  style={`
 
  transform:translateX(${$springCard}px) 
  rotateY(${$rotateY}deg) 
  rotateZ(${$rotateZ}deg)
  scale(${$scaleHover});
  z-index:${
    exited &&
    $cardStore.zIndex.findIndex((v) => {
      return v === index;
    }) >= 0
      ? $cardStore.zIndex.findIndex((v) => {
          return v === index;
        })
      : 5 -
        $cardStore.cards.findIndex((v) => {
          return v === index;
        })
  };
 `}
  on:mouseover={() => {
    if (!exited) {
      scaleHover.set(1.1);
    }
  }}
  on:mouseout={() => {
    if (!exited) {
      scaleHover.set(1);
    }
  }}
  bind:this={ele}
  class="card-container"
>
  <div draggable="false" class="image-container">
    <img draggable="false" src={image["front"]} alt="" />
  </div>
  <div draggable="false" class="image-container back-container">
    <img draggable="false" src={image["back"]} alt="" />
  </div>
</div>

<style lang="scss">
  .card-container {
    transform: rotateX(0deg);

    transform-style: preserve-3d;

    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;

    will-change: transform;
    touch-action: none;
    box-shadow: 0 12.5px 100px -10px rgb(50 50 73 / 20%),
      0 10px 10px -10px rgb(50 50 73 / 20%);
    @media screen and (max-width: 510px) {
      width: 200px;
      height: 350px;
    }
  }
  .image-container {
    overflow: hidden;
    border-radius: 10px;
    transform: rotateY(-180deg);
    height: 100%;
  }
  img {
    height: 100%;
    width: 100%;
    touch-action: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .back-container {
    content: "";

    z-index: -1;
    position: absolute;

    transform: rotateX(0deg) translate3d(0px, 0px, 1px);

    display: block;
    width: 100%;

    @media screen and (max-width: 510px) {
      width: 200px;
      height: 350px;
    }
  }
</style>
