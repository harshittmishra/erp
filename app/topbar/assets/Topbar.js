import Api from "assets/js/Api.js";
import Config from "assets/js/Config.js";
import Toggle from "assets/toggle/Toggle.js";
import Select from "assets/select/Select.js";

export default class Topbar {
  constructor() {
    this.initLocationSelector();
    this.initProfileDropdown();
    this.initSignOut();
  }

  initProfileDropdown() {
    const dropdown = document.getElementById("profileDropdown");

    const trigger = dropdown.querySelector(".selected");
    const panel = dropdown.querySelector(".menu");

    const toggle = new Toggle({
      trigger,
      panel,
      initialState: "closed",
      onOpen: () => {
        dropdown.classList.add("active");
      },
      onClose: () => {
        dropdown.classList.remove("active");
      },
    });
  }

  async initLocationSelector() {
    const locationSelector = document.getElementById("locationSelector");

    const [select] = await Select.create(locationSelector, {
      searchable: true,
      selectionType: "multiple",
      placeholder: "",
      data: [
        { value: "head-office", label: "rawls head office" },
        { value: "ware-house", label: "rawls ware house" },
      ],
      onChange: (data) => { },
    });

    select.setSelected(["head-office"]);
  }

  initSignOut() {
    const signoutBtn = document.getElementById("sign-out-btn");
    signoutBtn.addEventListener("click", () => this.logout());
  }

  async logout() {
    try {
      const result = await Api.post("/logout", {});
      window.location.replace(new URL("", Config.baseUrl).href);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
}
