<script>
  import { marqueeContentStore } from "./../components/Marquee/store.js";
  export let tl;
</script>

<svg
  on:click={() => {
    marqueeContentStore.close(tl);
  }}
  class="close-main"
  xmlns="http://www.w3.org/2000/svg"
  height="24px"
  viewBox="0 0 24 24"
  width="24px"
  fill="#000000"
  ><path d="M0 0h24v24H0V0z" fill="none" /><path
    d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
  /></svg
>

<style>
  .close-main {
    position: absolute;
    left: 12px;
    display: block;
    cursor: pointer;
    width: 32px;
    z-index:10;
  }
</style>
