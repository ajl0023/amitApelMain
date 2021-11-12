<script>
  import { cardStore } from "./cardStore.js";
  import { DragGesture } from "@use-gesture/vanilla";
  import { onMount } from "svelte";
  import { spring, tweened } from "svelte/motion";

  export let index;
  export let rotate;
  export let image;
  let ele;

  let exited;

  let rotateZ = tweened(rotate, {
    duration: 150,
  });
  let rotateY = tweened(rotate, {
    duration: 150,
  });
  const springCard = spring(0, {
    duration: 400,
    delay: 0,
  });

  const scaleHover = tweened(1, {
    duration: 200,
  });

  onMount(() => {
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
          springCard.set(450 * direction[0]);
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

  $: {
    if ($cardStore.shouldReturn) {
      setTimeout(() => {
        springCard.set(0);
      }, 1000 + index * 100);
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
  scale(${$scaleHover}) 
  ;

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
    width: 300px;
    height: 500px;

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
