
import Api from "assets/js/Api.js";
import Form from "assets/js/Form.js";
import Config from "assets/js/Config.js";
import Notify from "assets/notify/Notify.js";
import Loader from "assets/loader/Loader.js";

export default class Login {
  constructor() {
    this.init();
  }

  init() {
    this.initializeNotifications();
    this.initializeCarousel();
    this.initializeIntroScreen();
    this.initializeForm();
    this.bindEvents();
  }

  initializeNotifications() {
    this.notify = new Notify({
      mountId: "loginMessages",
    });
  }

  initializeCarousel() {
    $(".owl-carousel").owlCarousel({
      loop: true,
      margin: 10,
      items: 1,
      autoplay: true,
      autoplayTimeout: 1500,
      autoplayHoverPause: true,
    });
  }

  initializeIntroScreen() {
    document
      .getElementById("get_started_button")
      ?.addEventListener("click", () => {
        document.querySelector(".login_page.intro")
          ?.classList.remove("active");

        document.querySelector(".login_page.form")
          ?.classList.add("active");
      });
  }

  initializeForm() {
    this.form = new Form("#login-form");

    this.loginBtn = document.getElementById("login-btn");

    this.loginLoader = new Loader({
      mount: this.loginBtn,
      shouldDisable: true,
      state: {
        class: "is-loading",
      },

      onShow: (e) => {
        e.options.mount.textContent = "Logging..";
      },

      onHide: (e) => {
        e.options.mount.textContent = "Login";
      }
    });
  }

  bindEvents() {
    this.loginBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      this.login();
    });
  }

  async login() {
    this.loginLoader.show();

    try {
      const credentials = Object.fromEntries(
        this.form.getValues()
      );

      const result = await Api.post("/login", credentials);

      if (!result?.success) {
        throw new Error(result?.error || "Login failed");
      }

      this.handleLoginSuccess();

    } catch (error) {
      this.handleLoginError(error);

    } finally {
      this.loginLoader.hide();
    }
  }

  handleLoginSuccess() {
    this.notify.success({
      message: "Logged in successfully, Redirecting!",
      progress: true,
    });

    setTimeout(() => {
      window.location.replace(
        new URL(Config.landingPage, Config.baseUrl).href
      );
    }, 600);
  }

  handleLoginError(error) {
    if (error.message === "invalid credentials") {
      this.notify.error({
        message: "Invalid Credentials",
        progress: true,
      });

      return;
    }

    this.notify.error({
      message: "Something Went Wrong !",
      progress: true,
    });

    console.error("Login error:", error);
  }
}
