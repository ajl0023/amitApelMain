<script>
  import { afterUpdate, beforeUpdate } from "svelte";

  import { tweened } from "svelte/motion";

  export let nav;
  export let currentPage;
  export let handleNavChange;
  let navAnimation = tweened(currentPage === nav ? 100 : 0);
  $: {
    if (nav !== currentPage) {
      navAnimation.set(0);
    }
  }
</script>

<div
  class="header-button-container"
  on:mouseenter={() => {
    navAnimation.set(100);
  }}
  on:mouseleave={() => {
    if (currentPage !== nav) {
      navAnimation.set(0);
    }
  }}
>
  <li
    style="color:{currentPage === nav ? '#68208e' : 'black'}"
    on:click={() => handleNavChange(nav)}
  >
    {nav}
  </li>
  <div style="width:{$navAnimation}%" class={"underlined"} />
</div>

<style lang="scss">
  .header-button-container {
    cursor: pointer;
  }
  .underlined {
    border-radius: 4px;
    background-color: #68208e;
    height: 2px;
  }
</style>
