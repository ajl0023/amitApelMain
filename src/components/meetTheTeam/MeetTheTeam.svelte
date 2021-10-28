<script>
  import { onMount } from "svelte";
  import { Motion } from "svelte-motion";
  import Card from "./Card.svelte";
  import { cardStore } from "./cardStore";
  const images = [
    {
      front:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Luke_Card_dgfcrg.jpg",
      back:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Luke_Card_Back_j5zphk.jpg",
    },
    {
      front:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Mike_Card_yyevct.jpg",
      back:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Mike_Card_Back_pwet2v.jpg",
    },
    {
      front:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Yak_Card_c55nzc.jpg",
      back:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Yak_Card_Back_bsvk7b.jpg",
    },
    {
      front:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Elchin_Card_hhfjc2.jpg",
      back:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Elchin_Card_Back_ii2vul.jpg",
    },
    {
      front:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Omar_Card_frdbxy.jpg",
      back:
        "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Omar_Card_Back_weik5s.jpg",
    },
  ];

  const list = {
    visible: {
      transition: {
        when: "afterChildren",
        staggerChildren: 0.3,
      },
    },
    hidden: {
      border: "0px solid transparent",
      transition: {
        when: "beforeChildren",
      },
    },
  };
  const item = {
    visible: { opacity: 1, x: 0 },
  };

  const rotatedCards = [0, 3, 2, 4];

  let exited = [];
  cardStore.subscribe((v) => {
    if (v.length === 5) {
      cardStore.set([]);
    }
  });

  onMount(() => {
    cardStore.set([]);
  });
</script>

<div class="container">
  <h5 class="main-text-header">Meet The Team</h5>

  <Motion initial="visible" animate={"visible"} variants={list} let:motion
    ><ul class="card-container" use:motion>
      {#each images as card, i}
        <Card
          shouldReturn={false}
          variants={item}
          index={i}
          {exited}
          image={{
            front: card.front,
            back: card.back,
          }}
          rotate={rotatedCards.includes(i) ? i * 2 : 0}
        />
      {/each}
    </ul>
  </Motion>
</div>

<style lang="scss">
  .main-text-header {
    font-size: 6em;
    font-family: unisansB;
    font-weight: 900;
    letter-spacing: 3px;
    text-align: center;
    color: #68208e;

    position: relative;
    text-transform: uppercase;
  }
  .container {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }
  .card-container {
    display: flex;
    height: 55vh;
    justify-content: center;
    position: relative;
    margin-top: 40px;
    align-items: center;
  }
</style>
