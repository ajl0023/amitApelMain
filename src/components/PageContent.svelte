<script>
  import { onMount } from "svelte";

  import MainPageHeader from "./MainPageHeader.svelte";
  import { marqueeContentStore } from "./Marquee/store";

  export let currNav;

  let shouldLoadImages = false;
  onMount(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "z") {
        marqueeContentStore.update((v) => {
          v.content = "sculptures";
          return v;
        });
      }
      if (e.key === "x") {
        marqueeContentStore.update((v) => {
          v.content = "art";
          return v;
        });
      }
      if (e.key === "c") {
        marqueeContentStore.update((v) => {
          v.content = "furniture";
          return v;
        });
      }
    });
  });
</script>

<div class="page-content-container">
  <MainPageHeader currNav="{currNav ? currNav.name : ''}" />
  <div
    class:meetPage="{currNav && currNav.name === 'meet the team'}"
    class:press="{currNav && currNav.name === 'press'}"
    class="main-page-container"
  >
    {#if currNav}
      <svelte:component
        this="{currNav.component}"
        shouldLoadImages="{shouldLoadImages}"
      />
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

  .main-page-container {
    overflow: auto;

    width: 100vw;
    height: 100%;
  }
  .meetPage {
    overflow: unset;
  }
  .press {
    overflow: hidden;
  }
</style>
