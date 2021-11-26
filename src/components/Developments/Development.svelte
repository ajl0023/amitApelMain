<script>
  import { marqueeContentStore } from "../Marquee/store";

  import { data } from "./developmentsData";
  function reDirect(e) {
    e.preventDefault();
    window.open(data[$marqueeContentStore.content].link);
  }
</script>

{#if $marqueeContentStore.content}
  <div class="page-container"></div>
  <div class="container">
    <div class="left-page">
      <div class="header-container">
        <p class="sub-header">take a peek into our current</p>
        <h5 class="main-header">
          Project, <span class="property-header"
            >{data[$marqueeContentStore.content].title}</span
          >
        </h5>
      </div>
      <div class="text-wrapper">
        <div class="text-content-container">
          <p class="description">
            {data[$marqueeContentStore.content].description}
          </p>
        </div>
      </div>
      <button on:click="{reDirect}" class="redirect-button">visit site</button>
    </div>
    <div class="main-image-container">
      <div class="sub-image-container">
        <div class="aspect-ratio"></div>
        <img
          class="main-image sub"
          src="{data[$marqueeContentStore.content].img}"
          alt=""
        />
      </div>
      <img
        class="main-image"
        src="{data[$marqueeContentStore.content].img}"
        alt=""
      />
    </div>
  </div>
{/if}

<style lang="scss">
  .left-page {
    display: flex;
    flex-direction: column;

    width: 50vw;
    justify-content: center;
    padding: 5vw;
    height: 100%;
    @media screen and (max-width: 955px) {
      width: 100%;
      height: auto;
      padding: 2vw;
    }
    @media screen and (max-width: 420px) {
      align-items: center;
    }
  }

  .redirect-button {
    text-transform: uppercase;
    font-family: "Roboto Mono", monospace;
    font-weight: 800;
    background: #5d1089;
    border: none;
    color: white;
    cursor: pointer;
    margin-top: 1rem;
    text-align: center;

    border-radius: 4px;
    max-width: 200px;
    padding: 5px 15px;
    @media screen and (max-width: 420px) {
      width: 100%;
      max-width: 100%;
    }
  }
  .text-wrapper {
    max-width: 500px;
    @media screen and (max-width: 955px) {
      width: 100%;
    }
  }
  .header-container {
    .main-header {
      font-family: "Roboto Mono", monospace;
      text-transform: uppercase;
      margin-bottom: 1rem;
      font-size: 2em;
    }
    .sub-header {
      color: #5d1089;

      font-size: 0.8em;
      font-family: "Roboto Mono", monospace;
      text-transform: uppercase;
    }
    .property-header {
      color: #5d1089;
      font-weight: 900;
      font-family: unisansB;
    }
  }
  .text-content-container {
    text-align: left;

    .description {
      font-family: "Roboto Mono", monospace;

      font-size: 0.8em;
      @media screen and (max-width: 955px) {
        width: 100%;

        font-size: 1.1em;
      }
    }
  }
  .aspect-ratio {
    padding-bottom: 75%;
  }
  .sub-image-container {
    width: 25vw;
    border-radius: 4px;
    overflow: hidden;

    z-index: 2;
    min-width: 400px;

    box-shadow: 2px 6px 40px -3px #000000;
    position: relative;

    .sub {
      width: 100%;
      height: 100%;
      top: 0;
      position: absolute;
    }

    @media screen and (min-width: 1500px) {
      transform: translateX(-300px);
    }
    @media screen and (max-width: 955px) {
      transform: none;
      min-width: auto;
    }
  }

  .container {
    display: flex;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    @media screen and (max-width: 955px) {
      flex-direction: column;
      align-items: center;
      padding: 10px;
      overflow-x: hidden;
      overflow-y: auto;
      height: auto;
      justify-content: space-around;
    }
  }
  .main-image-container {
    height: 100%;
    width: 50vw;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &::before {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 2;
      content: "";
      background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.9192051820728291) 21%,
        rgba(255, 255, 255, 0.01) 100%
      );

      display: block;
    }
    .main-image {
      object-fit: cover;
      width: 100%;
      z-index: 1;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      position: absolute;
      height: 100%;
    }
    @media screen and (max-width: 955px) {

      width: 100%;
      height: 400px;
    }
  }
</style>
