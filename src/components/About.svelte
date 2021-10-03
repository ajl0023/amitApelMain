<script>
  import BgLogo from "./BgLogo.svelte";
  import amitPhoto from "../images/home/amitapel4 (1).webp";
</script>

<div class="container">
  

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
</style>
