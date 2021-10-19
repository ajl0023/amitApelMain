<script>
  import { images } from "./images";
</script>

<div class="container">
  <div class="content-container">
    <h5 class="main-text-header">Private Homes</h5>
    <div class="gallery-container">
      {#each images as img}
        <div class="grid-item-container">
          <div class="image-container">
            <img class="grid-image" src={img.img} alt="" />
          </div>
          <h5 class="label">{img.label}</h5>
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .grid-item-container {
    display: flex;
    flex-direction: column;
    .label {
      text-align: left;
      font-size: 2em;
      line-height: 0.8em;
      font-weight: 900;
      letter-spacing: 3px;
      font-family: unisansB;
      padding: 1.2rem;
      color: #68208e;
      text-transform: uppercase;
    }
    .image-container {
      width: 100%;
     
      height: 100%;
      .grid-image {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    }
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    padding-top: 10rem;
    justify-content: center;
  }
  .gallery-container {
    margin-top: 5rem;
    display: grid;
    max-width: 1300px;
    width: 100%;
    gap: 31px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
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
</style>
