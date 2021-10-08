<script>
  import { onMount } from "svelte";
  import BgLogo from "../BgLogo.svelte";
  import PageContent from "../PageContent.svelte";
  import { store } from "./animationStore";
  import MenuItem from "./MenuItem.svelte";
  import { menuItems } from "./menuItems";
  import mainLogo from "../../images/home/AA-logo-black-mac (1).svg";
  import About from "../About.svelte";

  import MalibuRebuild from "../MalibuRebuild.svelte";
  import MeetTheTeam from "../meetTheTeam/MeetTheTeam.svelte";
  import Press from "../press/Press.svelte";
  let menu;
  let currNav = "meet amit apel";
  let pageContent = false;
  const pages = {
    "meet amit apel": {
      component: About,
    },
    "malibu rebuild": {
      component: MalibuRebuild,
    },
    "meet the team": {
      component: MeetTheTeam,
    },
    press: {
      component: Press,
    },
  };
  const pagesArr = [
    {
      title: "meet amit apel",
      component: About,
    },
    { title: "malibu rebuild", component: MalibuRebuild },
    { title: "meet the team", component: MeetTheTeam },
    { title: "press", component: Press },
  ];
</script>

<div class="container">
  <div class="frame">
    <BgLogo text="Apel Design" />
    <div class="top-nav-container">
      <div class="logo-container">
        <img class="logo" src={mainLogo} alt="" />
      </div>
      <div class="header-nav-container" />
    </div>
  </div>
  <div class="menu-wrap">
    <nav bind:this={menu} class="menu">
      {#each menuItems as item, i}
        <MenuItem
          on:navChange={(e) => {
            console.log("test");
            pageContent = true;
            if (pages[e.detail]) {
              currNav = pages[e.detail];
            }
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
    <PageContent
      on:navChange={(e) => {
        pageContent = true;
        console.log(e);
        if (pages[e.detail.title]) {
          currNav = pages[e.detail.title];
        }
      }}
      {pagesArr}
      {currNav}
    />
  {/if}
</div>

<style lang="scss">
  .logo-container {
    max-width: 200px;

    .logo {
      width: 100%;
    }
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
    background-size: cover;
    background-image: url("../../images/home/Background Photo.jpg");
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    position: relative;
    justify-content: center;
  }
</style>
