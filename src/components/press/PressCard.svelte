<script>
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { mousePos, pressCard } from "./pressStore";
  export let img;
  export let link;

  let ele;
  const grayscale = tweened(1);
  const store = pressCard();

  $: {
    store.getMousePos($mousePos.x, $mousePos.y);
  }
  onMount(() => {
    store.init();
  });
</script>

<a
  style={`transform:translateX(${$store.tx}px) translateY(${$store.ty}px); filter:grayscale(${$grayscale})`}
  class="link-container"
  on:mouseenter={() => {
    grayscale.set(0);
  }}
  on:mouseleave={() => {
    grayscale.set(1);
  }}
  on:click={(e) => {
    e.preventDefault();
    window.open(link);
  }}
  href={""}
  ><div
    on:mouseenter={() => {
      grayscale.set(0);
    }}
    on:mouseleave={() => {
      grayscale.set(1);
    }}
    class="image-container"
  >
    <img class="image" bind:this={ele} src={img} alt="" />
  </div></a
>

<style lang="scss">
  .link-container {
    display: block;
    width: 13vw;
    min-width: 15vh;
    display: none;
    position: absolute;
    &:nth-child(1) {
      display: block;
      left: 0;
    }
    &:nth-child(2) {
      display: block;
      right: 0;
    }
    &:nth-child(3) {
      right: 0;
      top: 50px;
      right: 50px;
      margin: auto;
      display: block;
    }
    &:nth-child(4) {
      left: 0;
      top: 25vh;
      right: 0;
      width: 15vw;
      margin: auto;
      display: block;
    }
    &:nth-child(5) {
      left: 150px;
      right: 0;
      top: 80vh;
      margin: auto;
      display: block;
    }
    &:nth-child(6) {
      left: 0;

      bottom: -50px;
      margin: auto;
      display: block;
    }
    &:nth-child(7) {
      right: 0;

      bottom: -20px;
      margin: auto;
      display: block;
    }
  }
  .image-container {
    opacity: 1;
    width: 100%;

    .image-mask {
      position: absolute;
      opacity: 90%;
      width: 100%;
      height: 100%;
    }
    .image {
      cursor: pointer;
      width: 100%;
      object-fit: contain;
      object-position: center center;
    }
  }
</style>
