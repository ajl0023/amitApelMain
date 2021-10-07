<script>
  import { onMount } from "svelte";
  import mainLogo from "../images/home/AA-logo-black-mac (1).svg";
  import About from "./About.svelte";
  import BgLogo from "./BgLogo.svelte";
  import MalibuRebuild from "./MalibuRebuild.svelte";
  import MeetTheTeam from "./meetTheTeam/MeetTheTeam.svelte";
  import Press from "./press/Press.svelte";
  import gsap from "gsap";
  export let currNav;
  let container;
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
  onMount(() => {
    gsap.to(container, {
      translateY: -container.offsetTop,
    });
  });
</script>

<div bind:this={container} class="main-page-container">
  <BgLogo text={"apel design"} />
  <div class="top-nav-container">
    <div class="logo-container">
      <img class="logo" src={mainLogo} alt="" />
    </div>
    <div class="header-nav-container" />
  </div>
  <svelte:component this={pages[currNav].component} />
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
    z-index: 1;

    background-size: cover;
    background-image: url("../images/home/Background Photo.jpg");
    width: 100vw;
    height: 100vh;
    position: absolute;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
  .logo-container {
    max-width: 200px;
    .logo {
      width: 100%;
    }
  }
</style>
