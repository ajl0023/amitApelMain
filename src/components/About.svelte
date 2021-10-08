<script>
  import BgLogo from "./BgLogo.svelte";
  import amitPhoto from "../images/home/amitapel4 (1).webp";
</script>

<div class="container">
  <h5 class="main-text-header">Meet Amit Apel</h5>
  <div class="content-image-container">
    <img src={amitPhoto} alt="" />
  </div>
  <div class="main-text-content">
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
    text-align: center;
  }
  .main-text-header {
    font-size: 6em;

    font-weight: 900;
    letter-spacing: 3px;
    text-align: center;
    color: #68208e;
    text-transform: uppercase;
  }
  .content-image-container {
    max-width: 600px;
    width: 100%;
    img {
      width: 100%;
    }
  }
  .container {
    display: flex;
    flex-direction: column;
    gap: 25px;
    align-items: center;
  }
</style>
