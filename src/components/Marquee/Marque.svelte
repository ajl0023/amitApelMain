<script>
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import About from "../About.svelte";
  import Art from "../Art/Art.svelte";
  import { lgBarStore } from "../Bar/store";
  import ContactUs from "../ContactUs/ContactUs.svelte";
  import MalibuRebuild from "../MalibuRebuild.svelte";
  import MapWrapper from "../Map/MapWrapper.svelte";
  import MeetTheTeam from "../meetTheTeam/MeetTheTeam.svelte";
  import PageContent from "../PageContent.svelte";
  import Press from "../press/Press.svelte";
  import Sculpture from "../Sculpture/Sculpture.svelte";
  import WhatWeDo from "../WhatWeDo/WhatWeDo.svelte";
  import Bar3Gallery from "./../Bar-3-Gallery/Bar3Gallery.svelte";
  import GalleryModal from "./../Bar-3-Gallery/GalleryModal.svelte";
  import { privateHomesModal } from "./../Bar-3-Gallery/store.js";
  import BgLogo from "./../BgLogo.svelte";
  import Furniture from "./../Furniture/Furniture.svelte";
  import Modal from "./../Modal/Modal.svelte";
  import { modalStore } from "./../Modal/store.js";
  import Navbar from "./../Navbar/Navbar.svelte";
  import MenuItem from "./MenuItem.svelte";
  import { menuItems } from "./menuItems";
  import { marqueeContentStore } from "./store.js";
  export let index;

  let container;
  let currNav = "meet amit apel";

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
    "contact us": {
      component: ContactUs,
      name: "contact us",
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
    marqueeContentStore.initAnim();
  });
</script>

<Navbar
  on:closePageContent={() => {
    dispatch("closePageContent");
  }}
/>
<div class="marquee-animation-container page-wrapper">
  {#if $privateHomesModal.visible}
    <GalleryModal />
  {/if}
  {#if $modalStore.visible}
    <Modal />
  {/if}

  <div class="container flex-item">
    <div class="menu-wrap">
      <nav class="menu">
        {#each menuItems[$lgBarStore.currentIndex].pages as item}
          <MenuItem {index} {currNav} title={item.title} labels={item.labels} />
        {/each}
      </nav>
    </div>
    <BgLogo text={menuItems[$lgBarStore.currentIndex].category} />
    <div class="page-transition-black" />
    <div bind:this={container} class="page-content-container">
      <PageContent {index} currNav={pages[$marqueeContentStore.content]} />
    </div>
  </div>

  {#if !$marqueeContentStore.content}
    <MapWrapper />
  {/if}
</div>

<style lang="scss">
  .page-wrapper {
    display: flex;

    height: 100%;
    position: relative;
  }
  .page-content-container {
    padding: 20px 20px 0 20px;

    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    transform: translate(0%, 100%);
    z-index: 20;
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
    display: flex;
    align-items: center;
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
    z-index: 12;
    flex-direction: column;
    width: 100vw;

    position: relative;
    justify-content: center;
  }
</style>
