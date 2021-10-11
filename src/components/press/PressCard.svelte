<script>
  import { onMount } from "svelte";
  import { mousePos, pressCard } from "./pressStore";
  export let img;
  export let link;

  let ele;
  const store = pressCard();

  $: {
    store.getMousePos($mousePos.x, $mousePos.y);
  }
  onMount(() => {
    store.init();
  });
</script>

<a href={link}>
  <img
    class="image"
    style={`transform:translateX(${$store.tx}px) translateY(${$store.ty}px)`}
    bind:this={ele}
    src={img}
    alt=""
  /></a
>

<style lang="scss">
  .image {
    width: 100%;
    object-position: center center;
    height: 100%;
    object-fit: cover;
  }
</style>
