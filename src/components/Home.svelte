<script>
  import { shouldAnimate } from "./../animationController.js";
  import { Motion } from "svelte-motion";

  import Logo from "./Bar/Logo.svelte";
  import logoText from "../images/home/logo Text.png";
  import { afterUpdate, createEventDispatcher, onMount } from "svelte";
  import video from "../images/Render.mp4";
  import brushVid from "../images/brush.mp4";
  import gsap from "gsap";

  let loading = true;
  onMount(() => {
    gsap.to(".video-stroke", {
      opacity: 0,
      delay: 3,
    });
  });
  afterUpdate(() => {
    if (!loading) {
      gsap.to(".fade", {
        opacity: 1,
        delay: 5,
      });
    }
  });
</script>

{#if shouldAnimate}
  <div class="video-stroke">
    <video
      on:ended={() => {
        loading = false;
      }}
      class="video-bg"
      autoplay
      muted
    >
      <source class="brush" muted src={brushVid} type="video/mp4" />
    </video>
  </div>
{/if}

{#if !loading || shouldAnimate === false}
  <video class="video-bg" autoplay muted loop id="myVideo">
    <source src={video} type="video/mp4" />
  </video>
  <div class="container">
    <h5 class="fade">connecting people</h5>

    <Logo />

    <div class="logo-text-container fade">
      <img class="logo-text" src={logoText} alt="" />
    </div>

    <h5 class="fade">to the art of living</h5>
  </div>
{/if}

<style lang="scss">
  .video-bg {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .logo-text-container {
    max-width: 500px;
    width: 100%;
    z-index: 2;
    opacity: 0;
    padding-top: 20px;

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
    // background-image: url("../images/home/Background Photo.jpg");
    display: flex;
    flex-direction: column;
    padding: 80px;
    gap: 25px;
    justify-content: center;
    align-items: center;
    height: 100vh;

    overflow: hidden;
    &::after {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      content: "";
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
    }
    &:nth-child(4) {
    }
  }
</style>
