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
    on:handleMap="{(e) => {
      visible = e.detail;
    }}"
  />
  <div bind:this="{container}" class="map-container">
    {#if showMap}
      <div class="x-container">
        <div
          on:click="{() => {
            visible = false;
            showMap = false;
          }}"
          class="close-x close-main white"
        ></div>
      </div>
      <Map
        on:renderMap="{() => {
          showMap = true;
        }}"
        on:handleMap="{(e) => {
          visible = e.detail;
        }}"
        showMap="{showMap}"
        visible="{visible}"
      />
    {/if}
  </div>
</div>

<style lang="scss">
  .map-container {
    position: relative;
  }
  .x-container {
    background-color: white;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 5;
    padding: 5px;

    .close-x {
      width: 100%;
      height: 100%;
      right: auto;

      position: relative;
      &::before {
        background-color: black;
      }
      &::after {
        background-color: black;
      }
    }
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
