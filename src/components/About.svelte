<script>
  let shouldGlitch = false;
</script>

<div class="container">
  <h5 class="main-text-header">Meet Amit Apel</h5>
  <div
    on:mouseenter={() => {
      shouldGlitch = true;
      setTimeout(() => {
        shouldGlitch = false;
      }, 400);
    }}
    on:mouseleave={() => {
      shouldGlitch = false;
    }}
    class="glitch-image-wrapper"
  >
    <div class="main-image-container">
      <div class="image-main" />
    </div>
    <div
      class="content-image-container glitch-image-container {shouldGlitch
        ? 'glitch-container'
        : ''}"
    >
      <div class="glitch-image" />
      <div class="glitch-image" />
      <div class="glitch-image" />
      <div class="glitch-image" />
      <div class="glitch-image" />
    </div>
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
  //credits https://tympanus.net/codrops/2017/12/21/css-glitch-effect/
  @use '../miscStyles/glitchVars' as *;
  @use '../miscStyles/glitchMain';

  .main-text-content {
    max-width: 500px;
    color: black;
    text-align: center;
  }
  .glitch-image-wrapper {
    max-width: 568px;
    width: 100%;
    height: 466px;
    position: relative;
  }
  .main-image-container {
    position: absolute;

    width: 100%;
    height: 100%;
    .image-main {
      background-position: 50% 50%;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-image: url("../images/home/amitapel4 (1).webp");
    }
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
  .content-image-container {
    max-width: 600px;
    width: 100%;
    pointer-events: none;
  }

  .container {
    gap: 40px;
    display: flex;
    margin-top: 5rem;
    flex-direction: column;

    align-items: center;
  }
</style>
