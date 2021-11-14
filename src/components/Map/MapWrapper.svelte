<script>
  import Map from "./Map.svelte";
  import MapBar from "./MapBar.svelte";
  import gsap from "gsap";
  let visible = false;
  let showMap = false;
  let container;

  $: {
    if (visible) {
      gsap
        .to(container, {
          height: "100vh",
        })
        .then(() => {
          showMap = true;
        });
    } else {
      gsap.to(container, {
        height: "0vh",
      });
    }
  }
</script>

<div class="container">
  <MapBar
    on:handleMap={(e) => {
      visible = e.detail;
    }}
  />
  <div bind:this={container} class="map-container">
    {#if showMap}
      <div
        on:click={() => {
          visible = false;
          showMap = false;
        }}
        class="close-x close-main black"
      />
      <Map
        on:renderMap={(e) => {
          showMap = true;
        }}
        on:handleMap={(e) => {
          visible = e.detail;
        }}
        {showMap}
        {visible}
      />
    {/if}
  </div>
</div>

<style lang="scss">
  .map-container {
    position: relative;
  }
  .container {
    position: absolute;
    color: white;
    bottom: 0;
    background-color: white;
    width: 100%;
    z-index: 6;
  }
</style>
