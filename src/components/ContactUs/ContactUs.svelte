<script>
  let form;
  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData(form);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => {})
      .catch((error) => alert(error));
  };
</script>

<div class="page-container">
  <div class="content-container">
    <div class="misc-info-wrapper flex-item">
      <div class="main-misc-container">
        <div class="misc-info-container">
          <div class="info-container">
            <h5>Hours</h5>
            <p>Monday-Friday 9am-5pm</p>
          </div>
        </div>
      </div>
      <div class="main-misc-container">
        <div class="info-container">
          <h5>Address</h5>
          <p>33202 1/4 mulholland hwy</p>
          <p>malibu, ca 90265</p>
          <p>apeldesign@apeldesign.com</p>
        </div>
      </div>
    </div>
    <form
      bind:this="{form}"
      name="emailForm"
      data-netlify="true"
      class="form-container flex-item"
      netlify
    >
      <input type="hidden" name="form-name" value="emailForm" />

      <div class="contact-field">
        <label for="" class="contact-label">Email</label>
        <input class="contact-input" name="form-name" />
      </div>

      <div class="contact-field">
        <div class="contact-control">
          <label for="" class="contact-label">Name</label>

          <input
            id="name-input"
            class="contact-input"
            type="text"
            name="name"
          />
        </div>
      </div>
      <div class="contact-field">
        <div class="contact-control">
          <label for="" class="contact-label">Message</label>

          <input
            id="email-input"
            class="contact-input"
            type="email"
            name="email"
          />
        </div>
      </div>
      <div class="contact-field">
        <div class="contact-control">
          <label for="" class="contact-label">Country</label>

          <input
            id="country-input"
            class="contact-input"
            type="text"
            name="country"
          />
        </div>
      </div>
      <div class="contact-field">
        <div class="contact-control">
          <label for="" class="contact-label">Phone</label>

          <input
            id="phone-input"
            class="contact-input"
            type="phone"
            name="phone"
          />
        </div>
      </div>
      <div class="contact-field">
        <div class="contact-control">
          <label for="" class="contact-label">Message</label>
          <textarea
            id="message-input"
            class="contact-textarea contact-input"
            type="text"
            name="message"></textarea>
        </div>
      </div>
      <div class="contact-field">
        <div class="contact-control">
          <label for="checkbox">
            <input type="checkbox" name="checkbox" /> Subscribe to our newsletter
          </label>
        </div>
      </div>

      <div class="contact-field">
        <div class="contact-control">
          <input
            on:click="{handleSubmit}"
            type="submit"
            class="contact-button contact-input contact-is-link contact-is-fullwidth"
          />
        </div>
      </div>
    </form>
  </div>
</div>

<style lang="scss">
  .contact-field {
    @include globalMixins.flexGap(1, v);
  }
  .misc-info-wrapper {
    display: flex;
    margin-right: 1rem;
    font-family: "Roboto Mono", monospace;
    flex-direction: column;
    @media screen and (max-width: 610px) {
      margin-right: 0rem;
    }
  }
  .content-container {
    display: flex;
    padding: 1rem;
    height: 80%;
    justify-content: center;

    width: 100%;
    @media screen and (max-width: 610px) {
      flex-direction: column-reverse;
    }
    input[type="submit"] {
      background-color: #68208e;

      color: #fff;
      font-weight: 600;
      cursor: pointer;
    }
  }
  .info-container {
    text-align: center;
    background-color: white;
    box-shadow: rgba(60, 66, 87, 0.12) 0px 7px 14px 0px,
      rgba(0, 0, 0, 0.12) 0px 3px 6px 0px;
    padding: 48px;
    text-transform: uppercase;
    border-radius: 4px;
    h5 {
      color: #68208e;
    }
    p {
      font-size: 0.8em;
    }
  }
  .form-container {
    display: flex;
    color: #1a1f36;

    background-color: white;
    box-shadow: rgba(60, 66, 87, 0.12) 0px 7px 14px 0px,
      rgba(0, 0, 0, 0.12) 0px 3px 6px 0px;
    padding: 48px;
    width: 100%;

    max-width: 448px;
    background: white;
    border-radius: 4px;

    flex-direction: column;

    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
      Helvetica Neue, Ubuntu, sans-serif;
    @media screen and (max-width: 610px) {
      margin-bottom: 1.5rem;
      max-width: 100%;
    }
    @media screen and (max-width: 650px) {
      padding: 25px;
    }
  }

  .contact-input {
    width: 100%;
    font-size: 16px;
    line-height: 28px;
    padding: 8px 16px;
    width: 100%;
    min-height: 44px;
    border: unset;
    border-radius: 4px;

    outline-color: rgb(84 105 212 / 0.5);
    background-color: rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(60, 66, 87, 0.16) 0px 0px 0px 1px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px;
  }
  label {
    font-size: 14px;

    display: block;
    font-family: "Roboto Mono", monospace;
    font-weight: 400;
  }
  .main-misc-container {
    @include globalMixins.flexGap(0.4, v);
  }
</style>
