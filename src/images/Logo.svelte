<script>
  import { onDestroy } from "svelte";
  import { Motion } from "svelte-motion";
  import Bar from "../components/Bar.svelte";
  import "../global.scss";

  onDestroy(() => {});
  const bars = Array.from(" ".repeat(30));
</script>

<Motion let:motion>
  <div class="bar-container">
    {#each bars as bar, i}
      <Bar index={i} />
    {/each}
  </div>
</Motion>

<style lang="scss">
  .bar-container {
    height: 40vh;
    display: flex;
    gap: 20px;
    width: 100%;
    overflow: hidden;
    align-items: center;
    justify-content: center;

    position: relative;
  }
</style>
