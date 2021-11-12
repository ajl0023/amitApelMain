<script>
  import { cardImages } from "./cardStore.js";
  import { onMount } from "svelte";
  import arrow from "./../../images/cardArrow.png";
  import Card from "./Card.svelte";
  import { cardStore } from "./cardStore";

  const rotatedCards = [0, 3, 2, 4];

  onMount(() => {
    cardStore.init();
  });
  $: {
    if ($cardStore.exited.length === 6) {
    }
  }
</script>

<div class="page-container">
  <div class="container">
    <div class="card-layout-container">
      <div class="card-outline" />
      <div class="image-container">
        <img src={arrow} alt="" />
      </div>
      <ul class="card-wrapper">
        {#each cardImages as card, i}
          <Card
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
    </div>
  </div>
</div>

<style lang="scss">
  .card-outline {
    width: 300px;
    height: 500px;
    border-radius: 20px;
    margin-right: 50px;
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='53' ry='53' stroke='white' stroke-width='4'  stroke-dasharray='36%2c 18%2c 28%2c 25' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
    border-radius: 53px;
  }
  .card-layout-container {
    display: flex;
    width: 100%;
    margin-bottom: 140px;
    align-items: center;
    justify-content: center;
  }
  .image-container {
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
    width: 300px;
    height: 500px;

    @media screen and (max-width: 510px) {
      width: 200px;
      height: 400px;
    }
  }
  .container {
    max-width: 1600px;
    width: 100%;
  }
</style>
