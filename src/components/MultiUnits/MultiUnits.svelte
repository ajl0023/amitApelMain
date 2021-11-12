<script>
  import unitHomes from "./unitHomes.json";
</script>

<div class="container">
  <div class="content-container">

    <div class="gallery-container">
      {#each unitHomes as img}
        <div class="grid-item-container">
          <div class="image-container">
            <img loading="lazy" class="grid-image" src={img.url} alt="" />
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
      cursor: pointer;
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

    padding-top: 6rem;
    justify-content: center;
    .content-container {
      width: 100%;
      max-width: 1200px;
    }
  }
  .gallery-container {
    margin-top: 5rem;
    display: grid;
    max-width: 1300px;
    width: 100%;
    gap: 31px;
    grid-template-columns: repeat(auto-fill, minmax(calc(1300px / 4), 1fr));
  }

</style>
