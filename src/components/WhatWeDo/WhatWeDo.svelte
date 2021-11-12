<script>
  import dancingVideo from "../../images/dance.mp4";
</script>

<div class="page-container">
  <div class="container">
    <div class="content-container">
      <div class="video-container">
        <video class="video" autoplay muted loop id="myVideo">
          <source src={dancingVideo} type="video/mp4" />
        </video>
      </div>
      <div class="text-container">
        <p>
          We are an award-winning, multi-disciplinary design and development
          studio focused on bespoke architectural creations. Specializing in new
          development, private residences, specialty concepts, and hospitality
          projects, we have worked extensively across Europe, Asia, South
          America, and the US. Led by Amit Apel and Michael B. MacLaren (AIA),
          our diverse team is composed of some of the top design professionals
          in the country with wide experiences in institutional practice,
          commercial and residential work. Each project starts with a
          thoughtfully conceived design that complements the surrounding
          environment while challenging the boundaries of traditional
          architecture to create detailed spaces that are both functional and
          perennial. At the very core of every concept is one central
          experience: connecting people to the art of living.
        </p>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .content-container {
    max-width: 900px;
    font-size: 1.4em;
    color: #68208e;
    text-align: center;
    font-weight: 700;
    .video-container {
      margin: 1rem 0rem;
      .video {
        width: 100%;
      }
    }
  }
  .container {
    display: flex;

    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
  }
</style>
