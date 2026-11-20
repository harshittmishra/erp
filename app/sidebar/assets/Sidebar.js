import Toggle from "assets/toggle/Toggle.js";

export default class Sidebar {
  constructor() {
    this.sidebar = document.getElementById("sidebar");
    this.toggles = [];

    this.init();
  }

  init() {
    const items = this.sidebar.querySelectorAll(".item.collapsible");

    items.forEach((item) => {
      const trigger = item.querySelector(":scope > a");
      const panel = item.querySelector(":scope > .navigation");

      if (!trigger || !panel) return;

      const toggle = new Toggle({
        trigger,
        panel,
        closeOutside: false,
        closeEscape: false,
        initialState: "open",
        onOpen: () => {
          item.classList.add("active");
        },
        onClose: () => {
          item.classList.remove("active");
        },
      });

      this.toggles.push(toggle);
    });
  }

  destroy() {
    this.toggles.forEach((toggle) => toggle.destroy());
    this.toggles = [];
  }
}
