<script>
  import { onMount, createEventDispatcher } from "svelte";

  import mapJson from "./coordsFormatted.json";
  import gsap from "gsap";
  import { MarkerClusterer } from "@googlemaps/markerclusterer";
  import MapArrow from "./MapArrow.svelte";

  let markers = [];

  let container;

  function deleteMap() {}

  const dispatch = createEventDispatcher();
</script>

<div class="container">
  <div
    on:click={() => {
      dispatch("handleMap", true);
    }}
    class="bottom-bar-container"
  >
    <MapArrow />
    <h5>project map</h5>
  </div>
</div>

<style lang="scss">
  .container {
  

    z-index: 3;
    font-family: unisansB;
    .bottom-bar-container {
      text-transform: uppercase;
      font-size: 2em;
      padding: 5px;

      cursor: pointer;
      letter-spacing: 0.1em;
      background-image: url("./mapBar.png");
      text-align: center;
    }
  }
</style>
