<script>
  import gsap from "gsap";
  import { createEventDispatcher, onMount } from "svelte";
  import { marqueeStore } from "./animationStore";

  export let labels;
  export let title;
  export let pageContent;

  let menuItem;
  let menuItemA;
  let marquee;
  let marqueeInner;
  let store;

  onMount(() => {
    store = marqueeStore();
    store.init(menuItem, menuItemA, marquee, marqueeInner);
  });
  const dispatch = createEventDispatcher();
  $: {
    if (pageContent) {
      gsap.to(menuItem, {
        y: 1500,
      });
    }
  }
</script>

<div
  on:click={(e) => {
    e.stopPropagation();
    dispatch("navChange", title);
  }}
  bind:this={menuItem}
  class="menu__item"
>
  <div
    bind:this={menuItemA}
    on:mouseenter={(e) => {
      store.mouseEnter(e);
    }}
    on:mouseleave={(e) => {
      store.mouseLeave(e);
    }}
    class="menu__item-link"
  >
    {title}
  </div>
  <div bind:this={marquee} class="marquee">
    <div bind:this={marqueeInner} class="marquee__inner-wrap">
      <div class="marquee__inner" aria-hidden="true">
        {#each labels as label}
          <span>{label}</span>
          <div class="marquee__img" />
        {/each}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @keyframes marquee {
    100% {
      transform: translate3d(-50%, 0, 0);
    }
  }

  .marquee__inner {
    animation: marquee 15s linear infinite;
  }
  .marquee__img {
    width: 15vw;
    height: 70%;
    margin: 0 2vw;
    border-radius: 5vw;
    background-size: cover;
    background-position: 50% 50%;
  }

  .menu__item {
    cursor: default;
    position: relative;
    overflow: hidden;
    z-index: 5;
    font-family: unisansB;
    text-align: center;
    box-shadow: 0 -1px black;
  }

  .menu__item:last-child {
    box-shadow: 0 1px black, 0 -1px black;
  }

  .menu__item-link {
    display: block;
    position: relative;
    cursor: pointer;
    color: black;
    text-decoration: none;
  }

  .marquee {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background: #68208e;
    transform: translate3d(0, 101%, 0);
  }

  .marquee__inner-wrap {
    height: 100%;
    width: 100%;
    transform: translate3d(0, -101%, 0);
  }

  .marquee__inner {
    height: 100%;
    width: fit-content;
    align-items: center;
    display: flex;
    position: relative;
    animation: marquee 15s linear infinite;
    will-change: transform;
  }

  @keyframes marquee {
    100% {
      transform: translate3d(-50%, 0, 0);
    }
  }

  .menu__item-link,
  .marquee span {
    white-space: nowrap;
    font-size: 6vw;
    line-height: 1.2;
    font-weight: 600;
    padding: 1vh 1vw 0;
    text-transform: uppercase;
  }

  .marquee span {
    text-align: center;
    color: var(--marquee-text);
    font-weight: 400;
  }
</style>
