<script>
  import { onMount } from "svelte";
  import PageContent from "../PageContent.svelte";
  import { store } from "./animationStore";
  import MenuItem from "./MenuItem.svelte";
  import { menuItems } from "./menuItems";

  let menu;
  let currNav = "meet amit apel";
  let pageContent = false;
</script>

<div class="container">
  <div class="frame" />
  <div class="menu-wrap">
    <nav bind:this={menu} class="menu">
      {#each menuItems as item, i}
        <MenuItem
          on:navChange={(e) => {
            pageContent = true;
            currNav = e.detail;
          }}
          {currNav}
          {pageContent}
          title={item.title}
          labels={item.labels}
        />
      {/each}
    </nav>
  </div>
  {#if pageContent}
    <PageContent {currNav} />
  {/if}
</div>

<style lang="scss">
  .frame {
    position: fixed;
    text-align: left;
    z-index: 3;
    top: 0;
    left: 0;
    display: grid;
    align-content: space-between;
    width: 100%;
    max-width: none;

    height: 100vh;
    padding: 1.5rem 2rem 1rem;
    pointer-events: none;
    grid-template-columns: 25% 50% 25%;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      "logo credits links"
      "... ... ..."
      "... ... author";
  }
  .container {
    margin: 0;
    --color-text: #111;
    --color-bg: white;
    --color-link: #000;
    --color-link-hover: #000;
    --color-border: #a7927b;
    --marquee-bg: #000;
    --marquee-text: #fff;
    --menu-focus: #775e41;
    z-index: 3;
    position: relative;
    background-color: transparent;
    font-family: reason-new, -apple-system, BlinkMacSystemFont, Segoe UI,
      Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .menu-wrap {
    display: flex;

    flex-direction: column;
    width: 100vw;
    height: 100vh;
    position: relative;
    justify-content: center;
  }
</style>
