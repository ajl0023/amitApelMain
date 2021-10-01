<script>
  import Logo from "../images/home/Logo Sideways.png";
</script>

<div class="logo-container">
  <img src={Logo} alt="" />
  <h1 class="logo-caption">Apel Design</h1>
</div>

<style lang="scss">
  .logo-caption {
    text-transform: uppercase;
    letter-spacing: 10px;
    font-size: 3em;
    white-space: nowrap;
    transform: rotateZ(-90deg);
    transform-origin: center left;

  }
  .logo-container {
    max-width: 200px;
    display: flex;
    position: absolute;
    left: 0;
    width: 100%;

    img {
      object-fit: cover;
      height: auto;
      width: 100%;
    }
  }
</style>
