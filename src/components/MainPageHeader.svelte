<script>
  import { marqueeContentStore } from "./Marquee/store";

  const hideNav = new Set(["maliview", "aviator"]);
</script>

<h5
  class:inactive={hideNav.has($marqueeContentStore.content)}
  class:press={$marqueeContentStore.content === "press"}
  class:sm={$marqueeContentStore.content === "meet the team"}
  class="main-text-header"
>
  {$marqueeContentStore.content}
</h5>

<style lang="scss">
  .press {
    position: absolute;
  }
  .main-text-header {
    font-size: 6em;
    line-height: 0.8em;
    font-weight: 900;
    letter-spacing: 3px;

    white-space: nowrap;
    font-family: unisansB;
    text-align: center;
    background-color: transparent;
    top: 5vh;
    right: 0;
    left: 0;
    z-index: 10;

    padding: 20px;
    color: #68208e;
    text-transform: uppercase;
    @media screen and (max-width: 820px) {
      font-size: 10vw;
    }
  }
  .sm {
    font-size: 3em;
  }
  .inactive {
    display: none;
  }
</style>
