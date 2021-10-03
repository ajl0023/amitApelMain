<script>
  import mainLogo from "../images/home/AA-logo-black-mac (1).svg";

  import About from "./About.svelte";
  import BgLogo from "./BgLogo.svelte";
  import MalibuRebuild from "./MalibuRebuild.svelte";
  import MeetTheTeam from "./meetTheTeam/MeetTheTeam.svelte";
  let currentPage = "meet the team";
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
  };
</script>

<div class="main-page-container">
  <BgLogo text={currentPage} />
  <div class="top-nav-container">
    <div class="logo-container">
      <img class="logo" src={mainLogo} alt="" />
    </div>
    <div class="header-nav-container">
      {#each navButtons as nav}
        <li
          class={currentPage === nav ? "underlined" : ""}
          on:click={() => {
            if (pages[nav]) {
              currentPage = nav;
            }
          }}
        >
          {nav}
        </li>
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
  }
  .underlined {
    text-decoration: underline;
  }
  .top-nav-container {
    position: absolute;
    top: 0;
    left: 0;
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
    li {
      cursor: pointer;
    }
  }
  .logo-container {
    max-width: 200px;
    .logo {
      width: 100%;
    }
  }
</style>
