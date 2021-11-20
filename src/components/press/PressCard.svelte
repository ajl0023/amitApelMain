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
    display: none;

    &:nth-child(1) {
      display: block;
      grid-area: 1/2/5/5;
      @media screen and (max-width: 750px) {
        grid-area: 1/2/5/7;
      }
    }
    &:nth-child(2) {
      display: block;
      @media screen and (max-width: 750px) {
        grid-area: 1/15/5/20;
      }
      grid-area: 1/16/5/20;
    }
    &:nth-child(3) {
      display: block;
      @media screen and (max-width: 750px) {
        grid-area: 3/17/6/21;
      }
      grid-area: 3/18/6/21;
    }
    &:nth-child(4) {
      align-self: center;
      justify-self: center;
      display: block;
      grid-area: 9/8/13/15;
    }
    &:nth-child(5) {
      display: block;

      grid-area: 17/11/19/15;
      @media screen and (max-width: 750px) {
        grid-area: 17/9/23/15;
      }
    }
    &:nth-child(6) {
      display: block;
      grid-area: 16/3/19/7;
      @media screen and (max-width: 750px) {
        grid-area: 18/2/21/8;
      }
    }
    &:nth-child(7) {
      right: 0;
      display: block;
      bottom: -20px;
      grid-area: 14/17/20/20;
      @media screen and (max-width: 750px) {
        grid-area: 13/16/20/21;
      }
      margin: auto;
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
