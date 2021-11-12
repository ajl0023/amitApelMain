<script>
  import { marqueeContentStore } from "./../Marquee/store.js";
  import LeftArrow from "./../../images/LeftArrow.svelte";
  import Logo from "./../../images/home/Logo.svelte";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
</script>

<div class="top-nav-container">
  <div
    on:click={(e) => {
      e.stopImmediatePropagation();
      dispatch("closePageContent");
    }}
    class="logo-container"
  >
    <Logo />
  </div>
  {#if $marqueeContentStore.content}
    <LeftArrow />
  {/if}
</div>

<style lang="scss">
  .top-nav-container {
    width: 100%;

    background-color: black;
    padding: 10px;

    display: flex;

    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.25);
    .logo-container {
      cursor: pointer;
      width: 350px;

      position: relative;
      pointer-events: all;
      z-index: 5;
    }
  }
</style>
