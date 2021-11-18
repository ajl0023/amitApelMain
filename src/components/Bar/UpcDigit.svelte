<script>
  import BarPage from "./BarPage.svelte";
</script>

<div class="upc-digit" data-val={$$props["data-val"]}>
  <div class="bar bar-inactive" />
  {#if $$props.target}
    <BarPage index={$$props.index} />{:else}
    <div class="bar bar-inactive" />{/if}

  <div class="bar bar-inactive" />
  <div class="bar bar-inactive" />
</div>

<style lang="scss">
  @for $i from 0 through 9 {
    .upc-digit[data-val="#{$i}"] {
      @media screen and (max-width: 650px) {
        @if $i != 3 {
          display: none;
        } @else {
          width: 100%;
        }
      }
    }
  }
</style>
