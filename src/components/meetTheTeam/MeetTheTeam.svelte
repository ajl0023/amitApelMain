<script>
  import { marqueeContentStore } from "./../Marquee/store.js";
  import { cardImages } from "./cardStore.js";
  import { onMount } from "svelte";
  import arrow from "./../../images/cardArrow.png";
  import Card from "./Card.svelte";
  import { cardStore } from "./cardStore";

  const rotatedCards = [0, 3, 2, 4];
  let outline;
  let stack;
  let dropPosition;
  onMount(() => {
    cardStore.init(outline);
  });
</script>

<div class="page-container">
  <div class="container">
    <div class="card-layout-container">
      <div bind:this={outline} class="card-outline" />
      <div
        on:click={() => {
          cardStore.manualExit();
        }}
        class="arrow-image-container"
      >
        <img src={arrow} alt="" />
      </div>
      <ul bind:this={stack} class="card-wrapper">
        {#each cardImages as card, i}
          <Card
            {stack}
            {outline}
            {dropPosition}
            shouldReturn={false}
            index={i}
            image={{
              front: card.front,
              back: card.back,
            }}
            rotate={rotatedCards.includes(i) ? i * 2 : 0}
          />
        {/each}
      </ul>
      <!-- <div class="text-description-container">
        {#if $cardStore.cards.length > 0}
          <h5 class="card-name-header">
            {cardImages[$cardStore.cards[0]].description}
          </h5>
          <p class="descrip-container">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem
            esse eos harum, dicta nesciunt magnam numquam adipisci velit beatae
            illum necessitatibus dolores laboriosam, dignissimos nulla
            exercitationem eum. Ratione, exercitationem doloremque.
          </p>
        {/if}
      </div> -->
    </div>
  </div>
</div>

<style lang="scss">
  $cardSizeWidth: 300px;
  $cardSizeHeight: 500px;
  .card-name-header {
    font-size: 1.5em;
  }
  .descrip-container {
    font-size: 1.2em;
  }
  @mixin styles($cardSizeWidth, $cardSizeHeight) {
    .text-description-container {
      width: $cardSizeWidth;
      height: $cardSizeHeight;
      margin-left: 30px;
      aspect-ratio: 0.6;
      @media screen and (max-width: 850px) {
        display: none;
      }
    }
    .card-outline {
      width: $cardSizeWidth;
      height: $cardSizeHeight;
      border-radius: 20px;
      margin-right: 50px;
      background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='53' ry='53' stroke='white' stroke-width='4'  stroke-dasharray='36%2c 18%2c 28%2c 25' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
      border-radius: 53px;
      aspect-ratio: 0.6;
      @media screen and (max-width: 550px) {
        display: none;
      }
    }
    .card-layout-container {
      display: flex;
      width: 100%;
      margin-top: 40px;

      margin-bottom: 140px;
      align-items: center;
      justify-content: center;
    }
    .arrow-image-container {
      width: 60px;
      margin-right: 50px;
      img {
        width: 100%;
        object-fit: cover;
      }
    }
    .page-container {
      height: 100%;
      display: flex;
      align-items: center;
    }
    .card-wrapper {
      width: $cardSizeWidth;
      height: $cardSizeHeight;
      position: relative;
      aspect-ratio: 0.6;
    }
    .container {
      max-width: 1600px;
      width: 100%;
      z-index: 20;
    }
  }
  @include styles(300px, 500px);
  @media screen and (max-width: 1150px) {
    @include styles(200px, calc(200px / 0.6));
  }
</style>
