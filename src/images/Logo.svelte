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
  console.log(ele);
</script>

<Motion
  transition={{ duration: 4, delay: 0 }}
  animate={{
    height: "400px",
  }}
  let:motion
>
  <div style="height:80vh" use:motion bind:this={ele} class="bar-container">
    {#each bars as bar, i}
      <Bar {ele} index={i} offset={offset[i]} />
    {/each}
  </div>
</Motion>

<style lang="scss">
  .bar-container {
    top: 0;
    justify-content: space-between;
    z-index: 3;
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
  }
</style>
