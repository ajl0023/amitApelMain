<script>
  import { onDestroy, onMount } from "svelte";
  import Bar from "../components/Bar.svelte";
  import { spring, tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { Motion } from "svelte-motion";

  import "../global.scss";
  import Logo from "../images/Logo.svelte";
  let ele;
  let windowThreshHold = false;

  onMount(() => {});
  onDestroy(() => {});
  const bars = Array.from(" ".repeat(30));

  const offset = [];
  for (let i = 0; i < 30; i++) {
    offset.push(
      tweened(
        { rotate: 80 },

        {
          delay: i * 100,
          duration: 4000,
          easing: cubicOut,
        }
      )
    );
  }
  console.log(offset[0]);
  console.log(ele)
</script>

<div bind:this={ele} class="bar-container">
  {#each bars as bar, i}

    <Bar {ele} index={i} offset={offset[i]} />
  {/each}
</div>

<style lang="scss">
  .bar-container {
    top: 0;
    justify-content: space-between;
    z-index: 1;
    position: relative;
    width: 90%;
    display: flex;
    align-items: center;
    height: 800px;
  }
</style>
