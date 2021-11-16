<script>
  import MobileHome from "./MobileHome/MobileHome.svelte";
  import gsap from "gsap";
  import { afterUpdate, onMount } from "svelte";
  import brush1 from "../images/brush.mp4";
  import logoText from "../images/home/logo Text.png";
  import brush2 from "../images/Render.mp4";
  import {
    introAnimationStore,
    shouldAnimate,
  } from "./../animationController.js";
  import Logo from "./Bar/Logo.svelte";
  import { lgBarStore } from "./Bar/store";
  import Marque from "./Marquee/Marque.svelte";

  let loading = true;
  let marquee;
  let video1;

  const mobileCheck = () => {
    return window.innerWidth <= 780;
  };

  onMount(() => {
    introAnimationStore.init(mobileCheck());
    lgBarStore.initMarquee();
  });
</script>

<div bind:this={marquee} class="marquee-container-main">
  {#if $lgBarStore.pageContent}
    <Marque
      on:closePageContent={(e) => {
        lgBarStore.closeMarquee(mobileCheck() ? "mobile" : "desktop");
      }}
    />
  {/if}
</div>
<!-- {#if !mobile} -->

<div class="video-bg">
  <video
    bind:this={video1}
    class="video-brush"
    autoplay
    autobuffer
    muted
    playsinline
  >
    <source
      src={"https://res.cloudinary.com/dt4xntymn/video/upload/v1636870696/mainSite/Brush_Stroke_1_orzxdf.mp4"}
      type="video/mp4"
    />
  </video>
</div>

<div class="video-bg">
  <video
    class="video-render"
    autoplay
    loop
    autobuffer
    muted
    playsinline
    id="myVideo"
  >
    <source src={brush2} type="video/mp4" />
  </video>
</div>
<div class="container">
  <h5 class="main-text fade">connecting people</h5>

  <Logo />

  <div class="logo-text-container fade bar-sm">
    <img class="logo-text" src={logoText} alt="" />
  </div>

  <h5 class="main-text fade">to the art of living</h5>
</div>

<style lang="scss">
  .marquee-container-main {
    overflow: hidden;
    position: fixed;

    height: 20px;
    z-index: 5;
    width: 20px;
  }
  .main-text {
    text-align: center;
    white-space: nowrap;

    @media screen and (max-width: 780px) {
      padding-bottom: 0px;
      font-size: 2.5em;
    }
    @media screen and (max-width: 450px) {
      padding-bottom: 0px;
      font-size: 1.5em;
    }
  }
  .video-bg {
    &::-webkit-media-controls-panel {
      display: none !important;
      -webkit-appearance: none;
    }
    top: 50%;

    position: fixed;
    left: 50%;
    object-fit: cover;
    width: 100vw;
    height: 100vh;
    transform: translate(-50%, -50%);
    .video-brush {
      width: 100vw;
      opacity: 1;
      object-fit: cover;
    }
    .video-render {
      width: 100vw;
      opacity: 0;
      object-fit: cover;
    }
  }

  .logo-text-container {
    max-width: 500px;
    width: 100%;
    z-index: 2;
    opacity: 0;
    padding-top: 20px;
    @media screen and (max-width: 780px) {
      opacity: 1;
      padding-top: 0px;
    }
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
    @media screen and (max-width: 780px) {
      padding: 20px;
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
    @media screen and (max-width: 780px) {
      opacity: 1;
    }
  }
</style>
