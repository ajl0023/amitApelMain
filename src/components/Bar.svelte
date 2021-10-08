<script>
  import { afterUpdate, onMount } from "svelte";

  import { Motion, useAnimation } from "svelte-motion";
  import gsap from "gsap";
  import PageContent from "./PageContent.svelte";
  import { largeBarObj } from "../animationObj";
  export let index;
  export let animations;
  export let shouldPulse;
  let bar;

  onMount(() => {
    gsap.to(bar, {
      opacity: 1,
      delay: 4.5,
      duration: 5,
    });
  });
</script>

<div bind:this={bar} class="bar-container" />

<style lang="scss">
  .cover-image {
    height: 100%;
    object-position: center center;
    width: 100%;

    object-fit: cover;
  }

  .bar-container {
    z-index: 1;
    opacity: 0;
    pointer-events: none;
    overflow: hidden;
    height: 100%;
    position: absolute;
    background-color: white;

    &:nth-child(1) {
      left: 2%;
      top: 0%;

      width: 1%;
    }
    &:nth-child(2) {
      left: 3.6%;
      top: 0%;

      width: 0.9%;
    }
    &:nth-child(3) {
      left: 6.9%;
      top: 0%;

      width: 2%;
    }
    &:nth-child(4) {
      // left: 10.9%;
      left: 0;
      top: 0%;
    }

    &:nth-child(5) {
      left: 14.3%;
      top: 0%;

      // width: 2.7%;
    }
    &:nth-child(6) {
      left: 17.8%;
      top: 0%;

      width: 1.5%;
    }
    &:nth-child(7) {
      left: 20%;
      top: 0%;

      width: 1.1%;
    }
    &:nth-child(8) {
      left: 23.1%;
      top: 0%;

      width: 1.9%;
    }
    &:nth-child(9) {
      left: 25.7%;
      top: 0%;

      width: 1%;
    }
    &:nth-child(10) {
      left: 28.8%;
      top: 0%;

      width: 1%;
    }
    &:nth-child(11) {
      left: 32%;
      top: 0%;

      width: 1.9%;
    }
    &:nth-child(12) {
    }
    &:nth-child(13) {
      left: 46.6%;
      top: 0%;

      width: 1%;
    }
    &:nth-child(14) {
      left: 49.8%;
      top: 0%;

      width: 1.9%;
    }
    &:nth-child(15) {
      left: 54%;
      top: 0%;

      width: 0.9%;
    }
    &:nth-child(16) {
      left: 55.6%;
      top: 0%;

      width: 1.8%;
    }
    &:nth-child(17) {
      left: 59.5%;

      top: 0%;

      width: 1.1%;
    }

    &:nth-child(19) {
      left: 91.3%;
      top: 0%;

      width: 1.1%;
    }

    &:nth-child(20) {
      left: 64.5%;
      top: 0%;

      width: 1%;
    }
    &:nth-child(21) {
      left: 66.4%;
      top: 0%;

      width: 0.9%;
    }
    &:nth-child(22) {
      left: 69.4%;
      top: 0%;

      width: 1.9%;
    }
    &:nth-child(23) {
      left: 73.5%;
      top: 0%;

      width: 0.9%;
    }

    &:nth-child(24) {
      left: 79.9%;
      top: 0%;

      width: 1.7%;
    }
    &:nth-child(25) {
      left: 82.5%;
      top: 0%;

      width: 0.8%;
    }
    &:nth-child(26) {
      left: 85.5%;
      top: 0%;

      width: 1.2%;
    }
    &:nth-child(27) {
      left: 88.9%;
      top: 0%;

      width: 1.7%;
    }
    &:nth-child(28) {
      right: 0;
      top: 0%;
    }
    &:nth-child(29) {
      left: 97.9%;
      top: 0%;

      width: 1.7%;
    }
  }
</style>
