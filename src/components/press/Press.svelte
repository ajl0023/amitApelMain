<script>
  import { onDestroy, onMount } from "svelte";
  import PressCard from "./PressCard.svelte";
  import { mousePos } from "./pressStore";
  let windowHeight = 0,
    windowWidth = 0;

  onMount(() => {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
  });
  const images = [
    "https://res.cloudinary.com/dt4xntymn/image/upload/v1633380455/mainSite/press/Press_2_uiz2po.jpg",
    "https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_4_pl9uqy.jpg",
    "https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_3_jrf0mt.jpg",
    "https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_1_pt9bba.jpg",
    "https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_6_idnrik.jpg",
    "https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_5_e8oy37.jpg",
    "https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_7_fqqhhs.jpg",
  ];
  let cards = [];
</script>

<div class="container">
  <div class="text-container">
    <img
      src="https://res.cloudinary.com/dt4xntymn/image/upload/v1633392260/mainSite/press/Press_Words_PNG_lpqreu.png"
      alt=""
    />
  </div>
  {#each images as card, i}
    <div class="image-container">
      <PressCard
        {windowHeight}
        {windowWidth}
        bind:cards
        img={images[i]}
        index={i}
      />
    </div>
  {/each}
</div>

<style lang="scss">
  .text-container {
    z-index: 2;
    width: 80vw;
    opacity: 70%;
    img {
      width: 100%;
    }
  }
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .image-container {
    position: absolute;
    &:nth-child(2) {
      width: 15vw;
    }
    &:nth-child(3) {
      bottom: -12vw;
      left: 48vw;
      width: 15vw;
    }
    &:nth-child(4) {
      left: 8vw;
      top: 5vh;
      width: 15vw;
    }
    &:nth-child(5) {
      right: 8vw;
      bottom: -0.2vw;
      width: 12vw;
    }
    &:nth-child(6) {
      right: 4vw;
      top: 9vh;
      width: 15vw;
      z-index: 1;
    }
    &:nth-child(7) {
      bottom: -20vh;
      left: 9vw;

      width: 15vw;
    }
    &:nth-child(8) {
      top: 0;
      right: 12vw;
      width: 11vw;
    }
  }
</style>
