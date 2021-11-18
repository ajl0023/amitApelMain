<script>
  import { lgBarStore } from "./../Bar/store.js";
  import { marqueeContentStore } from "./../Marquee/store.js";
  import LeftArrow from "./../../images/LeftArrow.svelte";
  import Logo from "./../../images/home/Logo.svelte";
  import logo from "./../../images/home/logo.png";
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
    <img src={logo} alt="" />
  </div>
  {#if $marqueeContentStore.content}
    <LeftArrow />
  {/if}
</div>

<style lang="scss">
  .top-nav-container {
    width: 100%;
    background-color: rgb(111, 63, 138);

    padding: 10px;

    display: flex;

    justify-content: center;
    align-items: center;

    .logo-container {
      cursor: pointer;
      width: 120px;

      position: relative;
      pointer-events: all;
      z-index: 5;
      img {
        width: 100%;
      }
    }
  }
</style>
