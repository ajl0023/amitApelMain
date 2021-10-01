<script>
  import { Motion } from "svelte-motion";

  import Logo from "../images/Logo.svelte";
  import backgroundImage from "../images/home/Background Photo.jpg";
</script>

<div class="container">
  <Motion
    transition={{ duration: 1, delay: 3 }}
    let:motion
    animate={{ opacity: 1 }}
  >
    <h5 use:motion>connecting people</h5>
  </Motion>
  <Logo />
  <Motion
    transition={{ duration: 1, delay: 3 }}
    let:motion
    animate={{ opacity: 1 }}
  >
    <h5 use:motion>to the art of living</h5>
  </Motion>
</div>

<style lang="scss">
  .container {
    background-repeat: no-repeat;
    font-family: Orator;
    color: white;
    background-size: cover;
    background-image: url("../images/home/Background Photo.jpg");
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: black;
    overflow: hidden;
    &::before {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      content: "";
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.9);
    }
  }
  h5 {
    z-index: 2;
    opacity: 0;
    font-weight: 100;
    font-size: 4em;
    text-transform: uppercase;
  }
</style>
