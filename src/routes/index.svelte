<script>
  import { onMount } from "svelte";

  import Home from "../components/Home.svelte";

  import "../global.scss";

  onMount(() => {
    // function initMap() {
    //   // The location of Uluru
    //   const malibu = { lat: 34.0249999, lng: -118.773830238 };
    //   // The map, centered at Malibu
    //   const map = new google.maps.Map(document.getElementById("map"), {
    //     zoom: 10,
    //     center: malibu,
    //   });
    //   // The marker, positioned at Uluru
    //   const marker = new google.maps.Marker({
    //     position: malibu,
    //     map: map,
    //   });
    // }
    // initMap();
  });
</script>

<div class="container">
  <Home />
  <!-- <div id="map" /> -->
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
  #map {
    width: 100%;
    height: 100%;
  }
</style>
