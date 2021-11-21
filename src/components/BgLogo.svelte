<script>
  import Logo from "../images/home/Logo Sideways.png";
  export let text = "apel design";
</script>

<div class="logo-container">
  <img src={Logo} alt="" />
  <h1 class="logo-caption">{text}</h1>
</div>

<style lang="scss">
  .logo-caption {
    display: block;
    height: fit-content;
    font-family: unisansB;
    white-space: nowrap;
    color: #a5a5a5;
    font-weight: 900;
    transform: rotate(-180deg);
    font-size: 5em;
    writing-mode: vertical-lr;

    text-transform: uppercase;
  }

  .logo-container {
    max-width: 200px;
    display: flex;
    position: absolute;
    left: 0;
    top: 0;
    transform: translateY(20%);
    justify-content: center;
    width: 100%;

    z-index: 3;
    img {
      object-fit: cover;
      height: auto;
      width: 100%;
    }
  }
</style>
