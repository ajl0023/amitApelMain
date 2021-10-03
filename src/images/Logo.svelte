<script>
  import { onDestroy } from "svelte";
  import { Motion } from "svelte-motion";
  import Bar from "../components/Bar.svelte";
  import "../global.scss";

  onDestroy(() => {});
  let playAnimation;
  const bars = Array.from(" ".repeat(30));
</script>

<Motion
  let:motion
  transition={{
    delay: playAnimation ? 4.5 : 0,
    duration: playAnimation ? 1.5 : 0,
  }}
  animate={{
    height: "40vh",
  }}
>
  <div use:motion class="bar-container">
    {#each bars as bar, i}
      <Bar index={i} />
    {/each}
  </div>
</Motion>

<style lang="scss">
  .bar-container {
    height: 70vh;
    display: flex;
    gap: 20px;
    width: 100%;
    align-items: center;
    justify-content: center;

    position: relative;
  }
</style>
