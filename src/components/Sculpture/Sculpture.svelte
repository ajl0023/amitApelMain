<script>
  import { images } from "./images";
</script>

<div class="container">
  <h5 class="main-text-header">sculpture</h5>

  <div class="grid-container">
    {#each images as img}
      <div class="grid-item-container">
        <h5 class="label">{img.label}</h5>
        <div class="image-container">
          <img class="grid-image" src={img.img} alt="" />
        </div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 6rem;
    width: 100%;
  }
  .main-text-header {
    font-size: 6em;
    line-height: 0.8em;
    font-weight: 900;
    letter-spacing: 3px;
    font-family: unisansB;
    text-align: center;
    color: #68208e;
    text-transform: uppercase;
  }
  .grid-container {
    margin-top: 5rem;
    display: grid;
    max-width: 1862px;
    width: 100%;

    gap: 10px;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: 0.2fr 0.4fr 0.4fr 0.5fr;
  }
  .grid-item-container {
    width: 100%;

    display: flex;

    &:nth-child(5) {
      grid-area: span 2 / span 2;
    }
    &:nth-child(6) {
      img {
        object-position: -420px;
      }
    }
    &:nth-child(8) {
      grid-area: span 2 / span 2;
    }
    &:nth-child(13) {
      grid-area: span 2 / span 3;
    }
    &:nth-child(17) {
      grid-area: span 1 / span 2;
    }
    &:nth-child(18) {
      grid-area: span 2 / span 1;
    }
    &:nth-child(19) {
      grid-area: span 1 / span 1;
    }
    .label {
      transform: rotate(-180deg);

      writing-mode: vertical-lr;
      text-align: right;
      font-size: 2em;
      line-height: 0.8em;
      font-weight: 900;
      letter-spacing: 3px;
      font-family: unisansB;
      padding: 1.2rem;
      color: #68208e;
      text-transform: uppercase;
    }
    .grid-image {
      object-fit: cover;
      width: 100%;
      object-position: center center;
      height: 100%;
    }
  }
</style>
