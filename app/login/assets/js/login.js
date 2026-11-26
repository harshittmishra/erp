import Api from "assets/js/Api.js";
import Form from "assets/js/Form.js";
import Config from "assets/js/Config.js";
import Notify from "assets/notify/Notify.js";

export default class Login {
  constructor() {
    this.init();
  }

  init() {
    this.notify = new Notify({
      mountId: "loginMessages",
    });

    $(".owl-carousel").owlCarousel({
      loop: true,
      margin: 10,
      items: 1,
      autoplay: true,
      autoplayTimeout: 1500,
      autoplayHoverPause: true,
    });

    document
      .getElementById("get_started_button")
      ?.addEventListener("click", function () {
        document.querySelector(".login_page.intro")?.classList.remove("active");
        document.querySelector(".login_page.form")?.classList.add("active");
      });

    this.form = new Form("#login-form");

    //attaching events.
    document
      .getElementById("login-btn")
      .addEventListener("click", () => this.login());
  }

  async login() {
    const values = this.form.getValues();

    try {
      const result = await Api.post("/login", Object.fromEntries(values));

      if (result?.success) {
        this.notify.success({
          message: "Logged in successfully, Redirecting !",
          progress: true,
        });

        setTimeout(() => {
          window.location.replace(
            new URL(Config.landingPage, Config.baseUrl).href,
          );
        }, 600);
      } else {
        console.error(result?.error || "Login failed");
      }
    } catch (error) {
      if (error.message === "invalid credentials") {
        //show notification.
        this.notify.error({
          message: "Invalid Credentials",
          progress: true,
        });
      }

      console.error("Login error:", error);
    }
  }
}
