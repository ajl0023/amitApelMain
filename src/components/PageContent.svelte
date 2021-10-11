<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { amp, browser, dev, mode, prerendering } from "$app/env";
  import gsap from "gsap";
  export let currNav;
  export let pagesArr;
  let navOpen = false;
  let container;

  onMount(() => {
    gsap.to(container, {
      translateY: -container.offsetTop,
    });
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

<div bind:this={container} class="main-page-container">
  <svelte:component this={currNav.component} />
  <!-- <div class="categories-container">
    <div
      on:mouseenter={(e) => {
        gsap.to(".t1", {
          y: -3,
        });
        gsap.to(".t2", {
          y: 3,
        });
      }}
      on:mouseleave={() => {
        gsap.to(".t2", {
          y: 0,
        });
        gsap.to(".t1", {
          y: 0,
        });
      }}
      on:click={() => {
        navOpen = !navOpen;
      }}
      class="categories-label"
    >
      <h5>Categories</h5>
      <div class="triangle-container">
        <div class="t1" />
        <div class="t2" />
      </div>
    </div>

    <div class="list-item-container">
      {#each pagesArr as page}
        <div
          on:click={(e) => {
            e.stopPropagation();
            dispatch("navChange", page);
          }}
          class="list-item"
        >
          {page.title}
        </div>
      {/each}
    </div>
  </div> -->
</div>

<style lang="scss">
  .main-page-container {
    padding: 20px;
    display: flex;
    padding-top: 5rem;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    gap: 25px;
    z-index: 4;

    width: 100vw;
    height: 100vh;

    flex-direction: column;
    align-items: center;
    justify-content: center;
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

  .top-nav-container {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    right: 0;
    display: flex;
    padding-top: 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .header-nav-container {
    display: flex;

    list-style: none;
    color: black;
    text-transform: uppercase;
    gap: 25px;
    padding-top: 20px;
    font-size: 1.5em;
  }
</style>
