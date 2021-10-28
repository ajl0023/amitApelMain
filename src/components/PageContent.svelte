<script>
  import { browser } from "$app/env";
  import gsap from "gsap";
  import { onMount } from "svelte";
  export let currNav;
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
</style>
