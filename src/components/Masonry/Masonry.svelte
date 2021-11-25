<script>
  import { afterUpdate, beforeUpdate, onDestroy, onMount } from "svelte";

  import { marqueeContentStore } from "../Marquee/store";
  import { layout } from "./layout";

  import MasonryImage from "./MasonryImage.svelte";

  export let shouldLoadImages;
  let images = layout[$marqueeContentStore.content];
  let container;
  $: images = layout[$marqueeContentStore.content];
  function setlayout() {
    if (container) {
      const masonrySettings = {
        sm: { width: 430, columns: 1 },
        md: { width: 768, columns: 2 },
        lg: { width: 992, columns: 3 },
        xl: { width: 1500, columns: 4 },
      };
      const window_width =
        window.innerWidth ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;

      if (window_width <= masonrySettings.sm.width) {
        masonary(masonrySettings.sm.columns);
      } else if (window_width <= masonrySettings.md.width) {
        masonary(masonrySettings.md.columns);
      } else if (window_width <= masonrySettings.lg.width) {
        masonary(masonrySettings.lg.columns);
      } else {
        masonary(masonrySettings.xl.columns);
      }
    }
  }
  function masonary(col) {
    const container = document.getElementById("masonry");

    //get number of child elements
    const panels = document.querySelectorAll(".masonry-panel");

    const COL_COUNT = col;

    //create array that stores the total height of each 'column'
    let col_heights = [];
    for (let j = 0; j <= COL_COUNT; j++) {
      col_heights.push(0);
    }

    // set css 'order' property for each element
    for (let i = 0; i < panels.length; i++) {
      let order = (i + 1) % COL_COUNT || COL_COUNT; // Example: 10 % 3 = 1

      panels[i].style.order = order; // add div css property: order. Together with Flexbox, this property will define which column the element is listed in.

      //get element height
      let height = panels[i].offsetHeight;

      //Choose the belongin column, add the height of each child to array that stores column height value
      col_heights[order] += parseFloat(height);
    }

    //Set the height of masonry container to the heightest column
    const highest = Math.max.apply(Math, col_heights);
    container.style.maxHeight = highest + 10 + "px";
  }

  onMount(() => {
    window.addEventListener("resize", setlayout);
  });
  onDestroy(() => {
    window.removeEventListener("resize", setlayout);
  });
  afterUpdate(() => {
    setlayout();
  });
  let test;
  $: {
    test = $marqueeContentStore.content;
  }
  $: {
    test, container, setlayout();
  }
</script>

<div bind:this="{container}" class="container">
  <div id="masonry" class="flex-container {$marqueeContentStore.content}">
    {#if images}
      {#each layout[$marqueeContentStore.content].thumbs as img}
        <div class="item-container masonry-panel">
          <MasonryImage
            img="{img}"
            images="{images}"
            shouldLoadImages="{shouldLoadImages}"
          />
        </div>
      {/each}
    {/if}
  </div>
</div>

<style lang="scss">
  @use "sass:math";
  .container {
    width: 100%;
  }

  .item-container {
    // @include globalMixins.flexGap(1, vh);
    cursor: pointer;

    @media screen and (max-width: 900px) {
      flex: calc(100% / 5);
    }

    @media screen and (max-width: 600px) {
      flex: calc(100% / 3);
    }
    @media screen and (max-width: 480px) {
      flex: calc(100% / 1);
    }
  }

  #masonry {
    display: flex;
    width: 100%;
    flex-flow: column wrap;
  }

  .masonry-panel {
    /*will not wrap if use max-width*/

    flex: 2 0 auto;
    padding: 5px;
    min-width: 100px;
  }

  .masonry-content {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;

    max-width: 100%;
    height: auto;
    border-radius: 5px;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.2);
  }

  /* set panel with according to scree-size */
  /* These settings has to be consistant with 'mansonrySettings' in JS file */

  .art,
  .sculptures {
    .masonry-panel {
      width: math.div(100%, 4);
    }
    @media screen and (min-width: 769px) and (max-width: 992px) {
      .masonry-panel {
        width: 33%;
      }
    }

    @media screen and (min-width: 430px) and (max-width: 768px) {
      .masonry-panel {
        width: 50%;
      }
    }

    @media screen and (max-width: 430px) {
      .masonry-panel {
        width: 100%;
      }
    }
  }
  .furniture {
    .masonry-panel {
      width: math.div(100%, 3);
    }
    @media screen and (min-width: 769px) and (max-width: 992px) {
      .masonry-panel {
        width: 33%;
      }
    }

    @media screen and (min-width: 430px) and (max-width: 768px) {
      .masonry-panel {
        width: 50%;
      }
    }

    @media screen and (max-width: 430px) {
      .masonry-panel {
        width: 100%;
      }
    }
  }
</style>
