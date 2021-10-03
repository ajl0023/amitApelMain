<script>
  import { Motion } from "svelte-motion";

  export let rotate;

  export let variants,
    initial = undefined,
    custom = undefined,
    animate = undefined;
</script>

<Motion let:motion {variants} {initial} {custom} {animate}>
  <div style="transform: rotate({rotate}deg);" class="card-container">
    <div use:motion class="card" />
  </div>
</Motion>

<style lang="scss">
  .card {
    background-color: #fff;
    background-size: auto 85%;
    background-repeat: no-repeat;
    background-position: 50%;
    width: 55vh;
    max-width: 300px;
    height: 85vh;
    max-height: 500px;
    will-change: transform;
    border-radius: 10px;
    box-shadow: 0 12.5px 100px -10px rgb(50 50 73 / 40%),
      0 10px 10px -10px rgb(50 50 73 / 30%);
  }
  .card-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 300px;
    height: 500px;
   

    will-change: transform;
    touch-action: none;
  }
</style>
