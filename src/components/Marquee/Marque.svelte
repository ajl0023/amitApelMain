<script>
  import GalleryModal from "./../Bar-3-Gallery/GalleryModal.svelte";
  import { privateHomesModal } from "./../Bar-3-Gallery/store.js";
  import Navbar from "./../Navbar/Navbar.svelte";
  import Map from "../Map/MapBar.svelte";
  import Bar3Gallery from "./../Bar-3-Gallery/Bar3Gallery.svelte";

  import Modal from "./../Modal/Modal.svelte";
  import { modalStore } from "./../Modal/store.js";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";

  import { marqueeContentStore } from "./store.js";

  import About from "../About.svelte";
  import Art from "../Art/Art.svelte";
  import MalibuRebuild from "../MalibuRebuild.svelte";
  import MeetTheTeam from "../meetTheTeam/MeetTheTeam.svelte";
  import PageContent from "../PageContent.svelte";
  import Press from "../press/Press.svelte";
  import Sculpture from "../Sculpture/Sculpture.svelte";
  import WhatWeDo from "../WhatWeDo/WhatWeDo.svelte";
  import BgLogo from "./../BgLogo.svelte";
  import Furniture from "./../Furniture/Furniture.svelte";
  import MenuItem from "./MenuItem.svelte";
  import { menuItems } from "./menuItems";

  import MapWrapper from "../Map/MapWrapper.svelte";
  import gsap from "gsap";
  export let index;
  let container;
  let currNav = "meet amit apel";
  function closePage() {}
  let shouldLoadImages = false;
  const dispatch = createEventDispatcher();

  const pages = {
    "meet amit apel": {
      name: "meet amit apel",
      component: About,
    },
    "malibu rebuild": {
      component: MalibuRebuild,
      name: "malibu rebuild",
    },
    "meet the team": {
      component: MeetTheTeam,
      name: "meet the team",
    },
    press: {
      component: Press,
      name: "press",
    },
    "private homes": {
      component: Bar3Gallery,
      name: "private homes",
    },
    "multi units": {
      component: Bar3Gallery,
      name: "multi units",
    },
    sculpture: {
      component: Sculpture,
      name: "sculpture",
    },
    concept: {
      component: Bar3Gallery,
      name: "concept",
    },
    "what we do": { component: WhatWeDo, name: "what we do" },
    furniture: { component: Furniture, name: "furniture" },
    art: { component: Art, name: "art" },
  };

  onDestroy(() => {
    marqueeContentStore.reset();
  });
  onMount(() => {
    marqueeContentStore.init(container);
  });
</script>

<div class="page-wrapper">
  {#if $privateHomesModal.visible}
    <GalleryModal />
  {/if}
  {#if $modalStore.visible}
    <Modal />
  {/if}
  <Navbar
    on:closePageContent={(e) => {
      dispatch("closePageContent");
    }}
  />
  <div class="container">
    <div class="menu-wrap">
      <nav class="menu">
        {#each menuItems[index].pages as item}
          <MenuItem
            on:playAnimation={() => {
              const container = document.querySelector(".main-page-container");
            }}
            {index}
            {currNav}
            title={item.title}
            labels={item.labels}
          />
        {/each}
      </nav>
    </div>
    <BgLogo text={menuItems[index].category} />
    <div class="page-transition-black" />
    <div bind:this={container} class="page-content-container">
      <PageContent {index} currNav={pages[$marqueeContentStore.content]} />
      {#if $marqueeContentStore.content}{/if}
    </div>
  </div>

  {#if $marqueeContentStore.content}
    <MapWrapper />
  {/if}
</div>

<style lang="scss">
  .page-content-container {
    padding: 20px 20px 0 20px;

    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    z-index: 10;
    position: absolute;
    width: 100vw;
    height: 100%;
  }
  .page-transition-black {
    background-color: black;
    width: 100vw;
    position: absolute;
    bottom: 0;
    height: 0vh;
    z-index: 3;
  }

  .frame {
    position: fixed;
    text-align: left;
    z-index: 3;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: none;

    height: 100vh;
    padding: 1.5rem 2rem 1rem;
    pointer-events: none;
  }
  .container {
    height: 100%;
    margin: 0;
    --color-text: #111;
    --color-bg: white;
    --color-link: #000;
    --color-link-hover: #000;
    --color-border: #a7927b;
    --marquee-bg: #000;
    --marquee-text: #fff;
    --menu-focus: #775e41;
    z-index: 6;
    position: relative;
    background-color: white;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url("../../images/home/Background Photo.jpg");
  }
  .menu-wrap {
    font-family: reason-new, -apple-system, BlinkMacSystemFont, Segoe UI,
      Helvetica, Arial, sans-serif;
    display: flex;
    background-size: cover;
    z-index: 10;
    flex-direction: column;
    width: 100vw;
    height: 100%;
    position: relative;
    justify-content: center;
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
  .page-wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>
