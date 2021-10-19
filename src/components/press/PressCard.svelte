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
>
  <div class="image-mask" />
  <img
    style={`transform:translateX(${$store.tx}px) translateY(${$store.ty}px); filter:grayscale(${$grayscale})`}
    class="image"
    bind:this={ele}
    src={img}
    alt=""
  /></a
>

<style lang="scss">
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
    height: 100%;
    filter: grayscale(1);

    object-position: center center;

    object-fit: cover;
  }
</style>
