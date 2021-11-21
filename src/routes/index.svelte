<script>
  import Home from "./../components/Home.svelte";
  import MobileHome from "./../components/MobileHome/MobileHome.svelte";
  import MeetTheTeam from "./../components/meetTheTeam/MeetTheTeam.svelte";
  import Map from "../components/Map/MapBar.svelte";
  import Art from "./../components/Art/Art.svelte";
  import Furniture from "./../components/Furniture/Furniture.svelte";
  import Sculpture from "./../components/Sculpture/Sculpture.svelte";
  import { onMount } from "svelte";

  import "../global.scss";
</script>

<div class="container">
  <Home />
</div>

<style lang="scss">
  :global {
    @import "../test.scss";
  }
  .container {
    width: 100vw;
    height: 100vh;
    background-color: black;
  
  }
  #map {
    width: 100%;
    height: 100%;
  }
</style>
