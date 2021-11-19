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
    position: relative;
    display: none;
    &:nth-child(1) {
      display: block;
      grid-area: 1/2/1/6;
    }
    &:nth-child(2) {
      display: block;
      grid-area: 1/21/1/25;
    }
    &:nth-child(3) {
      display: block;
      grid-area: 3/23/4/27;
    }
    &:nth-child(4) {
      display: block;
      grid-area: 9/11/13/17;
    }
    &:nth-child(5) {
      display: block;
      grid-area: 23/13/27/20;
    }
    &:nth-child(6) {
      display: block;
      grid-area: 18/3/25/8;
    }
    &:nth-child(7) {
      display: block;
      grid-area: 17/22/39/28;
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
