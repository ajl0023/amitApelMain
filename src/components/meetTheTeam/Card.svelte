<script>
  import { onMount, tick } from "svelte";
  import { DragGesture } from "@use-gesture/vanilla";
  import {
    Motion,
    useDragControls,
    useMotionValue,
    useSpring,
    useVelocity,
    useAnimation,
  } from "svelte-motion";
  import img from "../../images/card1.jpg";
  import { spring, tweened } from "svelte/motion";

  import { writable } from "svelte/store";
  import { cardStore } from "./cardStore";
  export let index;

  let ele;

  let exited;
  export let rotate;
  export let image;
  const progress = spring(0, {
    duration: 400,
    delay: 3,
  });

  onMount(() => {
    new DragGesture(
      ele,
      ({ down, direction, active, movement: [mx, my], velocity }) => {
        if (down) {
          progress.set(mx);
        } else {
          progress.set(0);

          if (velocity[0] > 0.4) {
            progress.set(1500 * direction[0]);
            exited = true;
          }
        }
      }
    );
  });
  let rotationValue = tweened(180, {
    duration: 400,
  });
  cardStore.subscribe((v) => {
    if (v.length === 5) {
      setTimeout(() => {
        progress.set(0);
      }, 1000 + index * 100);
    }
  });
  $: {
    if (exited) {
      cardStore.update((v) => {
        return [...v, index];
      });
      exited = false;
    }
  }
</script>

<div
  on:mouseup={() => {
    if ($progress === 0) {
      if ($rotationValue === 180) {
        rotationValue.set(0);
      } else {
        rotationValue.set(180);
      }
    }
  }}
  style={`transform:translateX(${$progress}px) rotateY(${$rotationValue}deg) rotateZ(${rotate}deg)`}
  bind:this={ele}
  class="card-container"
>
  <div class="image-container">
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
  }
  .image-container {
    overflow: hidden;
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
      touch-action: none;
    }
  }

  .back-container {
    content: "";
    top: 0;
    z-index: -1;
    position: absolute;

    transform: rotateX(0deg) translate3d(0px, 0px, 1px);
    height: 100%;
    display: block;
    width: 100%;
    border-radius: 10px;
  }
  .card {
    background-color: #fff;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    z-index: 1;
    overflow: hidden;
    border-radius: 10px;
    background-repeat: no-repeat;
    background-position: 50%;
    width: 55vh;
    max-width: 300px;
    height: 85vh;

    max-height: 500px;
    will-change: transform;

    box-shadow: 0 12.5px 100px -10px rgb(50 50 73 / 40%),
      0 10px 10px -10px rgb(50 50 73 / 30%);
  }
</style>
