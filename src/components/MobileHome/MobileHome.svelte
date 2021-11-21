<script>
  import { largeBarsArr } from "./../Bar/animationObj.js";
  import Logo from "../../images/home/Logo.svelte";
  import images from "./images.json";
  import brush1 from "../../images/Render.mp4";
</script>

<div class="container">
  <div class="header-container">
    <div class="logo-container">
      <Logo />
    </div>
    <p>connecting people to the art of living</p>
  </div>
  <div class="video-stroke">
    <video class="video-bg" autoplay muted>
      <source class="brush" muted src={brush1} type="video/mp4" />
    </video>
  </div>
  <div class="content-container">
    <div class="list-container">
      {#each images as item}
        <div class="item-container">
          <h5>{item.label}</h5>
          <div class="thumbnail-container">
            <img src={item.url} alt="" />
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .content-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;

    width: 100%;

    overflow-y: scroll;
  }
  .video-stroke {
    position: fixed;
    z-index: 1;
    height: 60px;
    width: 100%;
    top: 0;
    .video-bg {
      width: 100%;
    }
  }
  .header-container {
    font-family: Orator;
    width: 100%;
    display: flex;
    z-index: 3;
    gap: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    white-space: nowrap;

    text-align: center;
    text-transform: uppercase;
  }
  .container {
    color: white;
    display: flex;
    align-items: center;
    overflow: hidden;
    gap: 10px;
    height: 100vh;
    padding: 10px;
    overflow: hidden;
    background-color: black;
    flex-direction: column;
    justify-content: center;
  }

  .logo-container {
    width: 350px;
  }
  .thumbnail-container {
    width: 40px;
    height: 40px;
    overflow: hidden;

    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }
  }
  .list-container {
    display: flex;
    gap: 20px;
    text-transform: uppercase;
    flex-direction: column;
    width: 100%;
    padding: 0 20px;
  }
  .item-container {
    padding: 1rem 1rem;
    border-radius: 72px;
    font-family: unisansB;
    font-size: 2em;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    background-color: #68208e;
  }
  .content-container {
    z-index: 1;
  }
</style>
