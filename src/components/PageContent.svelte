<script>
  import { marqueeContentStore } from "./Marquee/store.js";
  import MainPageHeader from "./MainPageHeader.svelte";
  import LeftArrow from "./../images/LeftArrow.svelte";
  import { modalStore } from "./Modal/store.js";
  import Modal from "./Modal/Modal.svelte";
  import { browser } from "$app/env";
  import gsap from "gsap";
  import { onDestroy, onMount } from "svelte";

  export let currNav;

  export let index;

  let navOpen = false;
  let shouldLoadImages = false;

  let container;
  function resizeMarquee() {
    const menu = document.querySelector(".menu-wrap");

    if ($marqueeContentStore.active) {
      menu.style.transform = `translate(0px,${window.innerHeight}px)`;
    }
  }
  onMount(() => {
    window.addEventListener("resize", resizeMarquee);
  });
  onDestroy(() => {
    window.removeEventListener("resize", resizeMarquee);
  });
</script>

<div class="page-content-container">
  <MainPageHeader currNav={currNav ? currNav.name : ""} />
  <div bind:this={container} class="main-page-container">
    {#if currNav}
      <svelte:component this={currNav.component} {shouldLoadImages} />
    {/if}
  </div>
</div>

<style lang="scss">
  .page-content-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media screen and (max-width: 900px) {
      font-size: 0.8rem;
    }
    @media screen and (max-width: 500px) {
      font-size: 0.6rem;
    }
  }
  .page-transition-black {
    background-color: black;
    width: 100vw;
    position: absolute;
    bottom: 0;
    height: 0vh;
    z-index: 3;
  }
  .main-page-container {
    overflow: auto;

    width: 100vw;
    height: 100%;
  }
</style>
