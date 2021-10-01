<script>
  import { Motion } from "svelte-motion";

  import Logo from "../images/Logo.svelte";
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
    font-family: Orator;
    color: white;

    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: black;
    overflow: hidden;
  }
  h5 {
    opacity: 0;
    font-weight: 100;
    font-size: 4em;
    text-transform: uppercase;
  }
</style>
