<script>
  import { onMount } from "svelte";
  import mapJson from "./coordsFormatted.json";
  export let showMap;

  function generateMap() {
    const malibu = { lat: 34.0692667, lng: -118.3729251 };
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: malibu,
      optimized: true,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ],
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

<div class="container">
  <div class:inactive="{showMap === false}" id="map"></div>
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
