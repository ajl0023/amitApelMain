<script>
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { currentPage } from "../../storeController";
  import { lgBarStore } from "../Bar/store";
  import GalleryModal from "../GalleryModal/GalleryModal.svelte";
  import { galleryModal } from "../GalleryModal/store";
  import MapWrapper from "../Map/MapWrapper.svelte";
  import PageContent from "../PageContent.svelte";

  import BgLogo from "./../BgLogo.svelte";
  import Modal from "./../Modal/Modal.svelte";
  import { modalStore } from "./../Modal/store";
  import Navbar from "./../Navbar/Navbar.svelte";
  import { pages } from "./marqueePages";
  import MenuItem from "./MenuItem.svelte";
  import { menuItems } from "./menuItems";
  import { marqueeContentStore } from "./store";
  export let index;

  let container;
  let currNav = "meet amit apel";

  const dispatch = createEventDispatcher();

  onDestroy(() => {
    marqueeContentStore.reset();
  });
  onMount(() => {
    marqueeContentStore.init(container);
    marqueeContentStore.initAnim();

    if ($marqueeContentStore.testing) {
      marqueeContentStore.setPageAnimation(currentPage);
    }
  });
</script>

<Navbar
  on:closePageContent="{() => {
    dispatch('closePageContent');
  }}"
/>
<div class="marquee-animation-container page-wrapper">
  {#if $galleryModal.visible}
    <GalleryModal />
  {/if}
  {#if $modalStore.visible}
    <Modal />
  {/if}

  <div class="container flex-item">
    <div class="menu-wrap">
      <nav class="menu">
        {#each menuItems[$lgBarStore.currentIndex].pages as item}
          <MenuItem
            index="{index}"
            currNav="{currNav}"
            title="{item.title}"
            labels="{item.labels}"
          />
        {/each}
      </nav>
    </div>
    <BgLogo text="{menuItems[$lgBarStore.currentIndex].category}" />
    <div class="page-transition-black"></div>
    <div bind:this="{container}" class="page-content-container">
      <PageContent
        index="{index}"
        currNav="{pages[$marqueeContentStore.content]}"
      />
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
