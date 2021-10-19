<script>
  import { onDestroy, onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import PressCard from "./PressCard.svelte";
  import { mousePos } from "./pressStore";
  let windowHeight = 0,
    windowWidth = 0;

  onMount(() => {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
  });

  const images = [
    {
      img:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633380455/mainSite/press/Press_2_uiz2po.jpg",
      link:
        "http://voyagela.com/interview/meet-amit-apel-apel-design-inc-malibu/",
    },
    {
      img:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_4_pl9uqy.jpg",
      link: "https://www.gessi.com/it/project/design/93",
    },
    {
      img:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_3_jrf0mt.jpg",
      link:
        "https://www.archiscene.net/interior-design/moment-hotel-amit-apel-design/",
    },
    {
      img:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_1_pt9bba.jpg",
      link:
        "http://voyagela.com/interview/meet-amit-apel-apel-design-inc-malibu/",
    },
    {
      img:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_6_idnrik.jpg",
      link:
        "https://www.latimes.com/business/realestate/hot-property/la-fi-hotprop-outside-box-20160510-story.html",
    },
    {
      img:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_5_e8oy37.jpg",
      link:
        "https://www.google.com/url?q=https://www.californiahomedesign.com/property/2015/03/27/open-house-obsession-little-holmby-looker-6495m/&sa=D&source=editors&ust=1633933659385000&usg=AOvVaw0XyO2cGSBqPsV15pNuMNcM",
    },
    {
      img:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633380454/mainSite/press/Press_7_fqqhhs.jpg",
      link:
        "https://www.homebuilderdigest.com/the-15-best-residential-architects-in-malibu-california/",
    },
  ];
  let text = [
    "https://res.cloudinary.com/dt4xntymn/image/upload/v1633988338/mainSite/press/text/Press_3_PNG_jnmqzk.png",
    "https://res.cloudinary.com/dt4xntymn/image/upload/v1633988338/mainSite/press/text/Press_2_PNG_dtejy7.png",
    "https://res.cloudinary.com/dt4xntymn/image/upload/v1633988338/mainSite/press/text/Press_4_PNG_zqtwne.png",
    "https://res.cloudinary.com/dt4xntymn/image/upload/v1633988338/mainSite/press/text/Press_5_PNG_ysj7nx.png",
    "https://res.cloudinary.com/dt4xntymn/image/upload/v1633988338/mainSite/press/text/Press_PNG_se76b5.png",
  ];
</script>

<div class="container">
  <div class="content-container">
    <div class="text-image-wrapper">
      {#each text as img, i}
        <div class="text-image-container">
          <img src={img} alt="" />
        </div>
      {/each}
    </div>

    {#each images as card, i}
      <div class="image-container">
        <PressCard
          {windowHeight}
          {windowWidth}
          img={images[i].img}
          link={images[i].link}
          index={i}
        />
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .text-image-wrapper {
    max-height: 700px;
    grid-area: 6/ 1 / 26 /26;
    display: grid;
    grid-template-columns: repeat(25, 4%);
    grid-template-rows: repeat(25, 4%);
    padding: 0 7vw;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    pointer-events: none;
    z-index: 4;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    .text-image-container {
      &:nth-child(1) {
        grid-area: 1/21/13/28;
        transform: rotateZ(25.8deg);
      }
      &:nth-child(2) {
        grid-area: 24/3/13/9;
        transform: rotateZ(-7.7deg);
      }
      &:nth-child(3) {
        grid-area: 26/15/13/28;
        transform: rotateZ(7.7deg);
      }
      &:nth-child(4) {
        grid-area: 11/3/16/24;
      }
      &:nth-child(5) {
        transform: rotateZ(-10deg);
        grid-area: 2/3/12/11;
      }
    }
  }

  .content-container {
    grid-template-columns: repeat(25, 4%);
    grid-template-rows: repeat(25, 4%);
    max-width: 1788px;
    display: grid;
    width: 100%;

    height: 100%;
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
    opacity: 0;
    &:nth-child(2) {
      grid-area: 8/11/20/16;
      opacity: 1;
      width: 100%;
    }
    &:nth-child(3) {
      grid-row-start: 22;
      grid-row-end: 30;
      grid-column-start: 13;
      grid-column-end: 18;
      opacity: 1;
    }
    &:nth-child(4) {
      grid-row-start: 5;
      grid-row-end: 14;
      grid-column-start: 3;
      grid-column-end: 7;
      opacity: 1;
    }
    &:nth-child(5) {
      grid-row-start: 18;
      grid-row-end: 23;
      grid-column-start: 21;
      grid-column-end: 24;
      opacity: 1;
    }
    &:nth-child(6) {
      grid-row-start: 5;
      grid-row-end: 16;
      grid-column-start: 20;
      grid-column-end: 25;
      opacity: 1;
      z-index: 2;
    }
    &:nth-child(7) {
      grid-row-start: 18;
      grid-row-end: 21;
      grid-column-start: 4;
      grid-column-end: 9;
      opacity: 1;
    }
    &:nth-child(8) {
      grid-row-start: 3;
      grid-row-end: 6;
      grid-column-start: 18;
      grid-column-end: 22;
      opacity: 1;
      z-index: 1;
    }
  }
</style>
