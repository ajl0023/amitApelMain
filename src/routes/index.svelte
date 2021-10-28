<script>
  import Home from "../components/Home.svelte";

  import "../global.scss";
</script>

<div class="container">
  <Home />
</div>

<style lang="scss">
  // .page-transition-white {
  //   background-color: white;
  //   width: 100vw;
  //   position: absolute;
  //   bottom: 0;
  //   height: 0vh;
  // }
  // .page-transition-black {
  //   background-color: black;
  //   width: 100vw;
  //   position: absolute;
  //   bottom: 0;
  //   height: 0vh;
  // }
  .container {
    background: #000;
    width: 100vw;
    height: 100vh;
  }
</style>
