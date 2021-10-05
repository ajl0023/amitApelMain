<script>
  import { tweened } from "svelte/motion";

  import mainLogo from "../images/home/AA-logo-black-mac (1).svg";

  import About from "./About.svelte";
  import BgLogo from "./BgLogo.svelte";
  import MalibuRebuild from "./MalibuRebuild.svelte";
  import MeetTheTeam from "./meetTheTeam/MeetTheTeam.svelte";
  import Navbutton from "./Navbutton.svelte";
  import Press from "./press/Press.svelte";

  let currentPage = "press";

  const navButtons = [
    "about",
    "meet the team",
    "what we do",
    "malibu rebuild",
    "press",
  ];

  const pages = {
    about: {
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
  const handleNavChange = (nav) => {
    if (pages[nav]) {
      currentPage = nav;
    }
  };
</script>

<div class="main-page-container">
  <BgLogo text={"apel design"} />
  <div class="top-nav-container">
    <div class="logo-container">
      <img class="logo" src={mainLogo} alt="" />
    </div>
    <div class="header-nav-container">
      {#each navButtons as nav}
        <Navbutton {handleNavChange} {currentPage} {nav} />
      {/each}
    </div>
  </div>
  <svelte:component this={pages[currentPage].component} />
</div>

<style lang="scss">
  .main-page-container {
    padding: 20px;
    display: flex;
    padding-top: 5rem;
    overflow-y: auto;
    height: 100%;
    gap: 25px;
    background-size: cover;
    background-image: url("../images/home/Background Photo.jpg");
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow-x: hidden;
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
