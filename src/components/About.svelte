<script>
  let shouldGlitch = false;
  import amit from "./../images/home/amitapel4 (1).webp";
</script>

<div class="page-container">
  <div class="container">
    <div class="content-container">
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
        <div class="main-image-container flex-item">
          <div class="image-main">
            <img class="image" src={amit} alt="" />
          </div>
        </div>
        <div
          class="flex-item content-image-container glitch-image-container {shouldGlitch
            ? 'glitch-container'
            : ''}"
        >
          {#each Array(5).fill("") as img}
            <div class="glitch-image">
              <img class="image" src={amit} {img} alt="" />
            </div>
          {/each}
        </div>
      </div>
      <div class="flex-item main-text-content">
        <p>
          As a gifted fifth-generation exterior and interior designer, Amit Apel
          arrived on the sunny shores of Southern California in 1999 after
          having been raised in Africa, Israel and throughout Europe. Upon his
          arrival, Amit purchased a modest Honda Magnum motorcycle to travel
          across the USA for three months. After his adventurous, cross-country
          tour and with little means, he opened a humble, 100 sq. ft. art studio
          within a locksmith shop on the beaches of Malibu, California and
          instantly became a local, buzz-worthy artist. Amit’s acrylic and oil
          paintings that were showcased in this very small shop quickly
          catapulted into high demand by local, celebrity clients who still
          treasure his paintings and collect his growing body of art design
          works ranging from paintings, sculptures, jewelry, apparel and home
          and outdoor décor and furnishings. With his savvy entrepreneurial
          determination inspired by his passionate drive to design and produce
          as a way of life, Amit founded Amit Apel Design, Inc.® in 2000. This
          boutique, custom design firm now based in Malibu, California has a
          well-established, stellar reputation that has been built over the
          years on a vast array of award-winning commercial and residential and
          interior designs that now span across Europe, Asia, South America as
          well as across the US.
        </p>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  //credits https://tympanus.net/codrops/2017/12/21/css-glitch-effect/
  @use '../miscStyles/glitchVars' as *;
  @use '../miscStyles/glitchMain';

  .container {
    overflow-y: auto;
    color: #68208e;
  }

  .content-container {
    display: flex;

    flex-direction: column;
    align-items: center;
  }
  .main-text-content {
    font-family: "Open Sans", sans-serif;
    text-align: center;
    font-size: 1.5em;
    max-width: 1200px;
    margin-top: 1.5rem;
    width: 100%;
  }
  .image {
    width: 100%;
  }
  .glitch-image-wrapper {
    max-width: 568px;
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  .main-image-container {
    width: 100%;
    height: 100%;
    .image-main {
      background-position: 50% 50%;
      width: 100%;
      height: 100%;
    }
  }

  .content-image-container {
    width: 100%;
    pointer-events: none;
  }
</style>
