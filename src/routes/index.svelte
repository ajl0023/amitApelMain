<script>
  import { onDestroy, onMount } from "svelte";
  import About from "../components/About.svelte";
  import Home from "../components/Home.svelte";
  import Marque from "../components/Marquee/Marque.svelte";
  import Press from "../components/press/Press.svelte";

  import "../global.scss";
  import Logo from "../images/Logo.svelte";

  let windowThreshHold = false;

  onMount(() => {});
  onDestroy(() => {});
</script>

<div class="container">
  <Home />
</div>

<style lang="scss">
  .container {
    background: #000;
    width: 100vw;
    height: 100vh;
  }
</style>
