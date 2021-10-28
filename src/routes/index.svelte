<script>
  import gsap from "gsap";

  import { onDestroy, onMount } from "svelte";
  import About from "../components/About.svelte";
  import Home from "../components/Home.svelte";
  import Marque from "../components/Marquee/Marque.svelte";
  import Press from "../components/press/Press.svelte";
  import Logo from "../components/Bar/Logo.svelte";
  import img from "../components/Bar/slideshows/SD Bar 1.mp4";
  import "../global.scss";

  let windowThreshHold = false;

  onMount(() => {});
  onDestroy(() => {});
</script>

<div class="container">
  <Home />
</div>

<style lang="scss">
  .page-transition-white {
    background-color: white;
    width: 100vw;
    position: absolute;
    bottom: 0;
    height: 0vh;
  }
  .page-transition-black {
    background-color: black;
    width: 100vw;
    position: absolute;
    bottom: 0;
    height: 0vh;
  }
  .container {
    background: #000;
    width: 100vw;
    height: 100vh;
  }
</style>
