<script>
  import { onDestroy, onMount } from "svelte";
  import arrow from "./../../images/cardArrow.png";
  import Card from "./Card.svelte";
  import { cardStore } from "./cardStore";
  import { cardImages } from "./cardStore.js";

  const rotatedCards = [0, 3, 2, 4];
  let outline;
  let stack;
  let dropPosition;
  let stackLength;
  $: ({ currentStack } = $cardStore);
  $: stackLength = currentStack.length;
  onMount(() => {
    cardStore.init(outline);
    cardStore.introAnim();
  });
  onDestroy(() => {
    cardStore.init(outline);
  });
  $: if (stackLength === 0) {
    cardStore.reset();
  }
</script>

<div class="page-container">
  <div class="container">
    <div class="card-layout-container">
      <div class="card-outline aspect-ratio">
        <div class="three-by-two aspect-ratio"></div>
        <div bind:this="{outline}" class="card-outline"></div>
      </div>
      <div
        on:click="{() => {
          cardStore.manualExit();
        }}"
        class="arrow-image-container"
      >
        <img src="{arrow}" alt="" />
      </div>
      <div draggable="false" class="aspect-ratio">
        <ul bind:this="{stack}" class="card-wrapper">
          {#each cardImages as card, i}
            <Card
              stack="{stack}"
              outline="{outline}"
              dropPosition="{dropPosition}"
              shouldReturn="{false}"
              index="{i}"
              image="{{
                front: card.front,
                back: card.back,
              }}"
              rotate="{rotatedCards.includes(i) ? i * 2 : 0}"
            />
          {/each}
        </ul>
        <div class="three-by-two aspect-ratio"></div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .three-by-two.aspect-ratio {
    padding-bottom: 156.666%;
  }
  .card-outline {
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='53' ry='53' stroke='white' stroke-width='4'  stroke-dasharray='36%2c 18%2c 28%2c 25' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
    border-radius: 53px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    @media screen and (max-width: 550px) {
      display: none;
    }
  }
  .aspect-ratio {
    max-width: 300px;
    width: 100%;
    z-index: 2;
    position: relative;
    pointer-events: none;
    .card-wrapper {
      width: 100%;
      height: 100%;
      top: 0;

      left: 0;
      position: absolute;

      perspective: 1500px;
      transform-style: preserve-3d;
    }
  }
  $cardSizeWidth: 300px;
  $cardSizeHeight: 500px;

  .card-layout-container {
    display: flex;
    width: 100%;
    margin-top: 40px;

    margin-bottom: 140px;
    align-items: center;
    justify-content: center;
  }
  .arrow-image-container {
    width: 50px;
    z-index: 1;
    margin-left: 50px;
    margin-right: 50px;
    cursor: pointer;
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

  .container {
    max-width: 1600px;
    width: 100%;
    z-index: 20;
  }

  .arrow-image-container {
    position: relative;
  }
</style>
