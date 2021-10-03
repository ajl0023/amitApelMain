<script>
  import { Motion } from "svelte-motion";

  import Card from "./Card.svelte";
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

  const rotatedCards = [0, 3, 2];
  const cards = [
    {
      image: "",
    },
    {
      image: "",
    },
    {
      image: "",
    },
    {
      image: "",
    },
  ];
</script>

<Motion
  initial="visible"
  animate={"visible"}
  variants={list}
  let:motion
  ><ul class="card-container" use:motion>
    {#each cards as card, i}
      <Card variants={item} rotate={rotatedCards.includes(i) ? i * 2 : 0} />
    {/each}
  </ul>
</Motion>

<style lang="scss">
  .card-container {
    position: relative;
  
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
