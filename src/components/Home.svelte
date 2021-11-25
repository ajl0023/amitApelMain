<script>
  import { onMount } from "svelte";
  import logoText from "../images/home/logo Text.png";
  import brush2 from "../images/Render.mp4";
  import { introAnimationStore } from "./../animationController.js";
  import Logo from "./Bar/Logo.svelte";
  import { lgBarStore } from "./Bar/store";
  import Marque from "./Marquee/Marque.svelte";

  const mobileCheck = () => {
    return window.innerWidth <= 650;
  };

  onMount(() => {
    introAnimationStore.init(mobileCheck());
    lgBarStore.initMarquee();
  });
</script>

<div class="marquee-container-main">
  {#if $lgBarStore.pageContent}
    <Marque
      on:closePageContent="{() => {
        lgBarStore.closeMarquee(mobileCheck() ? 'mobile' : 'desktop');
      }}"
    />
  {/if}
</div>
<!-- {#if !mobile} -->

<div class="video-bg">
  <video class="video-brush" autoplay autobuffer muted playsinline>
    <source
      src="{'https://res.cloudinary.com/dt4xntymn/video/upload/v1636870696/mainSite/Brush_Stroke_1_orzxdf.mp4'}"
      type="video/mp4"
    />
  </video>
</div>

<div class="video-bg">
  <video class="video-render" autoplay loop autobuffer muted playsinline>
    <source src="{brush2}" type="video/mp4" />
  </video>
</div>
<div class="container">
  <div class="flex-item main-text-container">
    <h5 class="main-text fade">connecting people</h5>
    <h5 class="main-text fade">to the art of living</h5>
  </div>
  <div class="flex-item logo-container">
    <Logo />
  </div>

  <div class="flex-item logo-text-container fade">
    <img class="logo-text" src="{logoText}" alt="" />
  </div>
</div>

<style lang="scss">
  .logo-container {
    width: 100%;
  }
  .marquee-container-main {
    overflow: hidden;
    position: fixed;
    display: flex;
    flex-direction: column;
    height: 20px;
    z-index: 5;
    width: 20px;
  }
  .video-brush {
    opacity: 1;
  }
  .video-render {
    opacity: 0;
  }

  .main-text-container {
    display: flex;

    .main-text {
      text-align: center;
      white-space: nowrap;
      line-height: 0.9;
      @include globalMixins.flexGap(0.5, h);
    }
    @media screen and (max-width: 1350px) {
      font-size: 0.5em;
    }
    @media screen and (max-width: 900px) {
      font-size: 0.3em;
      flex-direction: column;
      @include globalMixins.flexGap(0, h);
    }
    @media screen and (max-width: 550px) {
      font-size: 0.2em;
    }
  }
  .video-bg,
  video {
    &::-webkit-media-controls-panel {
      display: none !important;
      -webkit-appearance: none;
    }

    position: fixed;

    object-fit: cover;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
  }

  .logo-text-container {
    max-width: 500px;
    width: 100%;
    z-index: 2;
    opacity: 0;

    @media screen and (max-width: 650px) {
      opacity: 1;
      padding-top: 0px;
      max-width: 300px;
      width: 100%;
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

    justify-content: center;
    align-items: center;
    height: 100vh;

    overflow: hidden;
    .flex-item {
      @include globalMixins.flexGap(3.5, v);
    }
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
    @media screen and (max-width: 650px) {
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
    @media screen and (max-width: 650px) {
      opacity: 1;
    }
  }
</style>
