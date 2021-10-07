<script>
  import { onDestroy, onMount } from "svelte";
  import Home from "../components/Home.svelte";
  import Marque from "../components/Marquee/Marque.svelte";

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
</style>
