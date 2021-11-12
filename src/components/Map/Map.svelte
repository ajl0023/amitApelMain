<script>
  import { onMount, createEventDispatcher } from "svelte";

  import mapJson from "./coordsFormatted.json";
  export let showMap;
  export let visible;
  let container;
  const dispatch = createEventDispatcher();
  function generateMap() {
    const malibu = { lat: 34.0692667, lng: -118.3729251 };
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: malibu,
      optimized: true,
      fullscreenControl: false,
    });
    const infoWindow = new google.maps.InfoWindow({
      content: "",
      disableAutoPan: true,
    });
    function initMap() {
      for (let i = 0; i < mapJson.length; i++) {
        const coord = mapJson[i];
        if (coord) {
          addMarker(coord.geometry, coord.formatted_address);
        }
      }
      map.addListener("click", () => {
        infoWindow.close();
      });
    }
    function addMarker(position, address) {
      const marker = new google.maps.Marker({
        position,
        map,
      });
      marker.addListener("click", () => {
        infoWindow.setContent(address);
        infoWindow.open(map, marker);
      });
    }
    initMap();
  }
  onMount(() => {
    generateMap();
  });
</script>

<div bind:this={container} class="container">
  <div class:inactive={showMap === false} id="map" />
</div>

<style lang="scss">
  .container {
    color: black;
    height: 100%;
  }
  #map {
    width: 100%;
    height: 100%;
  }
  .inactive {
    display: none;
  }
</style>
