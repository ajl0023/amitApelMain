<script>
  import Logo from "../images/home/Logo Sideways.png";
  export let text = "apel design";
</script>

<div class="logo-wrapper">
  <div class="aspect-ratio"></div>
  <div class="logo-container">
    <img src="{Logo}" alt="" />
    <h1 class="logo-caption">{text}</h1>
  </div>
</div>

<style lang="scss">
  .logo-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 200px;
    transform: translateY(20%);
  }
  .aspect-ratio {
    padding-bottom: 236%;
  }
  .logo-caption {
    display: block;
    height: fit-content;
    font-family: unisansB;
    white-space: nowrap;
    color: #a5a5a5;
    font-weight: 900;
    transform: rotate(180deg);
    font-size: 3em;
    writing-mode: vertical-lr;

    text-transform: uppercase;
  }

  .logo-container {
    display: flex;
    width: 100%;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    z-index: 3;
    img {
      object-fit: fill;
      height: auto;

      height: 100%;
      width: 100%;
    }
  }
</style>
