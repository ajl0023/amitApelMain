<script>
  import { onDestroy, onMount } from "svelte";
  import Bar from "../components/Bar.svelte";

  import "../global.scss";
  import Logo from "../images/Logo.svelte";

  let windowThreshHold = false;

  onMount(() => {});
  onDestroy(() => {});
  const bars = Array.from(" ".repeat(30));
</script>

<div class="bar-container">
  {#each bars as bar, i}
    <Bar index={i} />
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
