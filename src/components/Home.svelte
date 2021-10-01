<script>
  import { Motion } from "svelte-motion";

  import Logo from "../images/Logo.svelte";
  import logoText from "../images/home/logo Text.png";
</script>

<div class="container">
  <Motion
    transition={{ duration: 2, delay: 4 }}
    let:motion
    animate={{ opacity: 1 }}
  >
    <h5 use:motion>connecting people</h5>
  </Motion>
  <Logo />
  <Motion
    transition={{ duration: 2, delay: 4 }}
    let:motion
    animate={{ opacity: 1 }}
  >
    <div use:motion class="logo-text-container">
      <img class="logo-text" src={logoText} alt="" />
    </div>
  </Motion>
  <Motion
    transition={{ duration: 2, delay: 4 }}
    let:motion
    animate={{ opacity: 1 }}
  >
    <h5 use:motion>to the art of living</h5>
  </Motion>
</div>

<style lang="scss">
  .logo-text-container {
    max-width: 600px;
    width: 100%;
    z-index: 2;
    opacity: 0;
    padding-top: 60px;
    
    .logo-text {
      height: auto;
      object-fit: cover;
      width: 100%;
    }
  }

  .container {
    background-repeat: no-repeat;
    font-family: Orator;
    color: white;
    background-size: cover;
    background-image: url("../images/home/Background Photo.jpg");
    display: flex;
    flex-direction: column;
    padding: 80px;
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
    letter-spacing: 5px;
    font-weight: 100;
    font-size: 4em;
    position: relative;
    text-transform: uppercase;
    &:nth-child(1) {
      padding-bottom: 6rem;
    }
    &:nth-child(4) {
      padding-top: 6rem;
    }
  }
</style>
