<script>
  import { DragGesture } from "@use-gesture/vanilla";
  import { onMount } from "svelte";
  import { spring, tweened } from "svelte/motion";
  import { cardStore } from "./cardStore";
  export let index;

  let ele;

  let exited;
  export let rotate;
  export let image;
  let offScreen = false;

  let rotationValueZ = tweened(rotate, {
    duration: 150,
  });
  const cardTransform = spring(0, {
    duration: 400,
    delay: 3,
  });
  const scaleHover = tweened(1, {
    duration: 200,
  });

  onMount(() => {
    new DragGesture(
      ele,
      ({ down, direction, active, movement: [mx, my], velocity }) => {
        if (down) {
          cardTransform.set(mx);
        } else {
          cardTransform.set(0);

          if (velocity[0] > 0.4) {
            cardTransform.set(600 * direction[0]);
            offScreen = true;
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
        cardTransform.set(0);
        exited = false;
        offScreen = false;
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

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  on:mousedown={() => {
    if (offScreen && Math.abs($cardTransform) >= 150) {
      cardStore.update((s) => {
        s.pop();
        return s;
      });
      offScreen = false;
    }
  }}
  on:mouseup={() => {
    if ($cardTransform === 0) {
      if ($rotationValue === 180) {
        rotationValue.set(0);
      } else {
        rotationValue.set(180);
      }
    }
  }}
  style={`transform: scale(${$scaleHover}) translateX(${$cardTransform}px) rotateY(${$rotationValue}deg) rotateZ(${$rotationValueZ}deg)`}
  bind:this={ele}
  class="card-container"
  on:mouseenter={(e) => {
    if (4 - $cardStore.length === index && offScreen === false) {
      scaleHover.set(1.3);
      rotationValueZ.set(0);
    }
  }}
  on:mouseleave={() => {
    scaleHover.set(1);
    rotationValueZ.set(rotate);
  }}
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
    box-shadow: 0 12.5px 100px -10px rgb(50 50 73 / 40%),
      0 10px 10px -10px rgb(50 50 73 / 30%);
  }
  .image-container {
    overflow: hidden;
    transform: rotateY(-180deg);

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
    z-index: 10;
    overflow: hidden;
    border-radius: 10px;
    background-repeat: no-repeat;
    background-position: 50%;
    width: 55vh;
    max-width: 300px;
    height: 85vh;

    max-height: 500px;
    will-change: transform;
  }
</style>
