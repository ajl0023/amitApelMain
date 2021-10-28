<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { amp, browser, dev, mode, prerendering } from "$app/env";
  import gsap from "gsap";
  import BgLogo from "./BgLogo.svelte";
  export let currNav;
  export let pagesArr;
  export let index;

  let navOpen = false;
  let shouldLoadImages = false;
  let container;
  let shouldPlayTransition = index === 17 || index === 23;

  onMount(() => {
    let tl = gsap.timeline();

    if (index === 3) {
      gsap.to(container, {
        translateY: -container.offsetTop,
      });
    } else if (shouldPlayTransition) {
      tl.to(".page-transition-black", {
        height: "100vh",
        ease: "power3.in",

        duration: "1",
      })
        .to(container, {
          top: 0,
        })
        .to(
          ".page-transition-black",
          {
            height: "0vh",
            ease: "power3.in",

            duration: "0.8",
            onComplete: () => {
              shouldLoadImages = true;
            },
          },
          "<"
        );
    }
  });
  $: {
    if (navOpen && browser) {
      gsap.to(".list-item-container", {
        height: "auto",
        duration: 0.15,
      });
    } else {
      gsap.to(".list-item-container", {
        height: "0",
        duration: 0.15,
      });
    }
  }
  const dispatch = createEventDispatcher();
</script>

{#if shouldPlayTransition}
  <div class="page-transition-black" />
{/if}

<div bind:this={container} class="main-page-container">
  <svelte:component this={currNav.component} {shouldLoadImages} />
</div>

<style lang="scss">
  .page-transition-black {
    background-color: black;
    width: 100vw;
    position: absolute;
    bottom: 0;
    height: 0vh;
    z-index: 3;
  }
  .main-page-container {
    padding: 20px;

    overflow-x: hidden;

    gap: 25px;
    z-index: 4;
    position: absolute;
    width: 100vw;
    height: 100%;

    background-image: url("../../images/home/Background Photo.jpg");
  }
  .list-item-container {
    height: 0px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
    font-size: 1.3em;
    overflow: hidden;
  }

  .list-item {
    top: 0;
    z-index: 1;
    cursor: pointer;
    position: relative;
    font-weight: 600;

    text-transform: uppercase;
  }
  .categories-container {
    position: fixed;
    right: 0;
    top: 30vh;
    right: 20vw;
    z-index: 3;
    color: #68208e;

    .categories-label {
      font-size: 2em;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      text-transform: uppercase;
      .triangle-container {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
    }
    .t1 {
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;

      border-bottom: 5px solid #68208e;
    }
    .t2 {
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;

      border-top: 5px solid #68208e;
    }
  }
</style>
