<script>
  import mainLogo from "../images/home/AA-logo-black-mac (1).svg";
  import BgLogo from "./BgLogo.svelte";
  import amitPhoto from "../images/home/amitapel4 (1).webp";
</script>

<div class="main-page-container">
  <BgLogo />
  <div class="top-nav-container">
    <div class="logo-container">
      <img class="logo" src={mainLogo} alt="" />
    </div>
    <div class="header-nav-container">
      <li>about</li>
      <li>meet the team</li>
      <li>what we do</li>
      <li>malibu rebuild</li>
      <li>press</li>
    </div>
  </div>
  <div class="content-image-container">
    <img src={amitPhoto} alt="" />
  </div>
  <div class="main-text-content">
    <h5 class="main-text-header">Meet Amit Apel</h5>
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia, nulla.
      Earum beatae perspiciatis quisquam ut, ipsam cum dolorem pariatur
      praesentium accusamus, eum aspernatur. Iusto neque doloremque, assumenda
      quod iure quae.
    </p>
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia, nulla.
      Earum beatae perspiciatis quisquam ut, ipsam cum dolorem pariatur
      praesentium accusamus, eum aspernatur. Iusto neque doloremque, assumenda
      quod iure quae.
    </p>
  </div>
</div>

<style lang="scss">
  .main-text-content {
    max-width: 600px;
    color: black;
    .main-text-header {
      font-size: 3em;

      font-weight: 900;
      letter-spacing: 3px;
      text-align: center;

      text-transform: uppercase;
      &::after {
        content: "";
        height: 2px;
        width: 40%;

        margin: 0 auto;
        margin-top: 20px;
        margin-bottom: 20px;
        display: block;
        background-color: black;
      }
    }
  }
  .content-image-container {
    margin-top: 4rem;
    img {
      width: 100%;
    }
  }
  .top-nav-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    padding-top: 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .header-nav-container {
    display: flex;

    list-style: none;
    color: black;
    text-transform: uppercase;
    gap: 25px;
    padding-top: 20px;
    font-size: 1.5em;
    li {
      cursor: pointer;
    }
  }
  .logo-container {
    max-width: 200px;
    .logo {
      width: 100%;
    }
  }
  .main-page-container {
    padding: 20px;
    display: flex;
    padding-top: 5rem;
    overflow-y: auto;
    height: 100%;
    gap: 25px;
    background-size: cover;
    background-image: url("../images/home/Background Photo.jpg");
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
