<script>
  import { createEventDispatcher } from "svelte";
  import MapArrow from "./MapArrow.svelte";

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
      
      padding: 10px;
      cursor: pointer;
      letter-spacing: 0.1em;
      background-image: url("./mapBar.png");
      text-align: center;
    }
  }
  h5{
   margin-bottom: -10px;
  }
</style>
