<script>
  import { Motion } from "svelte-motion";

  import Card from "./Card.svelte";

  import { cardStore } from "./cardStore";
  const images = {
    front: [
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633333779/mainSite/meet%20the%20team/Cards/front/Luke_Card_cuxo3o.jpg",
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633333779/mainSite/meet%20the%20team/Cards/front/Mike_Card_b56jkd.jpg",
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633333779/mainSite/meet%20the%20team/Cards/front/Yak_Card_eqb303.jpg",
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633333778/mainSite/meet%20the%20team/Cards/front/Elchin_Card_hwuron.jpg",
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633333778/mainSite/meet%20the%20team/Cards/front/Omar_Card_lxruab.jpg",
    ],
    back: [
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633333910/mainSite/meet%20the%20team/Cards/back/Luke_Card_Back_lftzp9.jpg",
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633333910/mainSite/meet%20the%20team/Cards/back/Mike_Card_Back_ywkl6h.jpg",
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633333910/mainSite/meet%20the%20team/Cards/back/Yak_Card_Back_ridv0l.jpg",
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633333910/mainSite/meet%20the%20team/Cards/back/Elchin_Card_Back_tmm5mo.jpg",
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633333910/mainSite/meet%20the%20team/Cards/back/Omar_Card_Back_zy5qsb.jpg",
    ],
  };

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

  let ison = false;

  const rotatedCards = [0, 3, 2, 4];

  let exited = [];
  cardStore.subscribe((v) => {
    if (v.length === 5) {
      cardStore.set([]);
    }
    console.log($cardStore);
  });
</script>

<Motion initial="visible" animate={"visible"} variants={list} let:motion
  ><ul class="card-container" use:motion>
    {#each images.front as card, i}
      <Card
        shouldReturn={false}
        variants={item}
        index={i}
        {exited}
        image={{
          front: images.front[i],
          back: images.back[i],
        }}
        rotate={rotatedCards.includes(i) ? i * 2 : 0}
      />
    {/each}
  </ul>
</Motion>

<style lang="scss">
  .card-container {
    display: flex;

    justify-content: center;
    position: relative;
    align-items: center;
  }
  .card {
    background-color: #fff;
    background-size: auto 85%;
    background-repeat: no-repeat;
    background-position: 50%;
    width: 55vh;
    max-width: 300px;
    height: 85vh;
    max-height: 500px;
    will-change: transform;
    border-radius: 10px;
    box-shadow: 0 12.5px 100px -10px rgb(50 50 73 / 40%),
      0 10px 10px -10px rgb(50 50 73 / 30%);
  }
</style>
