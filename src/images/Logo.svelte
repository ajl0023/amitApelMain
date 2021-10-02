<script>
  import { onDestroy, onMount } from "svelte";
  import Bar from "../components/Bar.svelte";
  import { spring, tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { Motion } from "svelte-motion";

  import "../global.scss";
  import Logo from "../images/Logo.svelte";
  import { largeBarObj } from "../animationObj";
  let ele;
  let windowThreshHold = false;
  let delay = [];
  let delayCount = 0;

  onDestroy(() => {});
  const bars = Array.from(" ".repeat(30));
</script>

<Motion
  animate={{
    height: "400px",
  }}
  let:motion
>
  <div style="height:80vh" bind:this={ele} class="bar-container">
    {#each bars as bar, i}
      <Bar {ele} index={i} />
    {/each}
  </div>
</Motion>

<style lang="scss">
  .bar-container {
    display: flex;
    width: 100%;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
  }
</style>
