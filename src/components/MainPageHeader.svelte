<script>
  import { marqueeContentStore } from "./Marquee/store.js";
  export let currNav;
</script>

<h5 class="main-text-header">{currNav}</h5>

<style lang="scss">
  .main-text-header {
    font-size: 6em;
    line-height: 0.8em;
    font-weight: 900;
    letter-spacing: 3px;

    white-space: nowrap;
    font-family: unisansB;
    text-align: center;

    top: 5vh;
    right: 0;
    left: 0;

    padding: 20px;
    color: #68208e;
    text-transform: uppercase;
    @media screen and (max-width: 820px) {
      font-size: 10vw;
    }
  }
</style>
