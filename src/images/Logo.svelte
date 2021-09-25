<script>
  import { onDestroy, onMount } from "svelte";
  import Bar from "../components/Bar.svelte";
  import { spring, tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import "../global.scss";
  import Logo from "../images/Logo.svelte";

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
</script>

<div class="bar-container">
  {#each bars as bar, i}
    <Bar index={i} offset={offset[i]} />
  {/each}
</div>

<style lang="scss">
  .bar-container {
    top: 0;
    z-index: 1;
    position: relative;
    width: 90%;
    height: 400px;
  }
</style>
