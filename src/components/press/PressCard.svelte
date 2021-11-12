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

<!-- <a
  on:click={(e) => {
    e.preventDefault();
    window.open(link);
  }}
  on:mouseenter={() => {
    grayscale.set(0);
  }}
  on:mouseleave={() => {
    grayscale.set(1);
  }}
  href={""}
  class="link-container"
/> -->
<div
  on:mouseenter={() => {
    grayscale.set(0);
  }}
  on:mouseleave={() => {
    grayscale.set(1);
  }}
  style={`transform:translateX(${$store.tx}px) translateY(${$store.ty}px); filter:grayscale(${$grayscale})`}
  class="image-container"
>
  <img class="image" bind:this={ele} src={img} alt="" />
</div>

<style lang="scss">
  .image-container {
    opacity: 0;
    height: 100%;
    height: fit-content;
    filter: grayscale(1);
    &:nth-child(2) {
      grid-area: 8/11/20/16;
      opacity: 1;
      width: 100%;
      @media screen and (max-width: 740px) {
        grid-area: 8/8/20/17;
      }
    }
    &:nth-child(3) {
      grid-row-start: 22;
      grid-row-end: 30;
      grid-column-start: 13;
      grid-column-end: 18;
      opacity: 1;
      @media screen and (max-width: 740px) {
        grid-row-start: 22;
        grid-row-end: 30;
        grid-column-start: 15;
        grid-column-end: 24;
        opacity: 1;
      }
    }
    &:nth-child(4) {
      grid-row-start: 5;
      grid-row-end: 14;
      grid-column-start: 3;
      grid-column-end: 7;
      opacity: 1;
      @media screen and (max-width: 740px) {
        grid-row-start: 4;
        grid-row-end: 14;
        grid-column-start: 2;
        grid-column-end: 7;
        opacity: 1;
      }
    }
    &:nth-child(5) {
      grid-row-start: 18;
      grid-row-end: 23;
      grid-column-start: 21;
      grid-column-end: 24;
      opacity: 1;
      @media screen and (max-width: 740px) {
        grid-row-start: 16;
        grid-row-end: 23;
        grid-column-start: 17;
        grid-column-end: 25;
        opacity: 1;
      }
    }
    &:nth-child(6) {
      grid-row-start: 5;
      grid-row-end: 16;
      grid-column-start: 20;
      grid-column-end: 25;
      opacity: 1;
      z-index: 2;
    }
    &:nth-child(7) {
      @media screen and (max-width: 740px) {
        grid-row-start: 20;
        grid-row-end: 21;
        grid-column-start: 1;
        grid-column-end: 9;
        opacity: 1;
      }
      grid-row-start: 18;
      grid-row-end: 21;
      grid-column-start: 4;
      grid-column-end: 9;
      opacity: 1;
    }
    &:nth-child(8) {
      grid-row-start: 3;
      grid-row-end: 6;
      grid-column-start: 18;
      grid-column-end: 22;
      opacity: 1;
      z-index: 1;
    }
  }
  .link-container {
    width: 100%;
    display: block;
    position: relative;
  }
  .image-mask {
    position: absolute;
    opacity: 90%;
    width: 100%;
    height: 100%;
  }
  .image {
    cursor: pointer;
    width: 100%;

    object-position: center center;

    object-fit: cover;
  }
</style>
