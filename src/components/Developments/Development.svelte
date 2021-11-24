<script>
  import { marqueeContentStore } from "../Marquee/store";

  import { data } from "./developmentsData";
  function reDirect(e) {
    e.preventDefault();
    window.open(data[$marqueeContentStore.content].link);
  }
</script>

<div class="page-container"></div>
<div class="container">
  <div class="text-wrapper">
    <div class="text-content-container">
      <p class="sub-header">take a peek into our current</p>
      <h5 class="main-header">
        Project, <span class="property-header"
          >{data[$marqueeContentStore.content].title}</span
        >
      </h5>

      <p class="description">
        {data[$marqueeContentStore.content].description}
      </p>
      <button on:click="{reDirect}" class="redirect-button">visit site</button>
    </div>
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

<style lang="scss">
  .property-header {
    color: #5d1089;
    font-weight: 900;
    font-family: unisansB;
  }
  .redirect-button {
    text-transform: uppercase;
    font-family: unisans;
    font-weight: 800;
    background: #5d1089;
    border: none;
    color: white;
    cursor: pointer;
    margin-top: 1rem;
    padding: 5px 15px;
  }
  .text-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 50vw;
    padding: 8vw;
    @media screen and (max-width: 955px) {
      width: 100%;
      height: 50vh;
      padding: 8vw 8vw 8vw 8vw;
    }
  }
  .text-content-container {
    text-align: left;

    .main-header {
      font-family: unisans;
      margin-bottom: 1rem;
      font-size: 2em;
    }
    .sub-header {
      color: #5d1089;
      font-family: unisansB;
      font-size: 0.8em;
      margin-bottom: 2rem;
      text-transform: uppercase;
    }
    .description {
      font-family: unisans;
      font-weight: 700;
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
    position: absolute;
    width: 25vw;
    border-radius: 4px;
    overflow: hidden;
    top: 50%;
    min-width: 400px;
    transform: translate(-20%, -80%);
    box-shadow: 2px 6px 40px -3px #000000;

    .sub {
      top: 0;
      position: absolute;
    }
    @media screen and (max-width: 955px) {
      top: 50%;
      min-width: auto;
      width: 60vw;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .container {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    @media screen and (max-width: 955px) {
      flex-direction: column;
    }
  }
  .main-image-container {
    height: 100%;
    width: 50vw;

    position: relative;

    &::before {
      width: 100%;
      height: 100%;
      position: absolute;
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
      height: 100%;
    }
    @media screen and (max-width: 955px) {
      width: 100vw;
      height: 50vh;
    }
  }
</style>
