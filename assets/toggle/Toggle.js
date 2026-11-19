export default class Toggle {
  constructor({
    trigger,
    panel,
    closeOutside = true,
    closeEscape = true,
    stateAttr = "data-state",
    initialState = null,
    onOpen = null,
    onClose = null,
  }) {
    if (!trigger || !panel) {
      throw new Error("Toggle requires trigger and panel.");
    }

    this.triggerEl = this.getTrigger(trigger);
    this.panelEl = this.getPanel(panel);

    if (this.triggerEl === this.panelEl) {
      throw new Error("Toggle trigger and panel cannot be the same element.");
    }

    if (typeof closeOutside !== "boolean" || typeof closeEscape !== "boolean") {
      throw new Error("Toggle closeOutside and closeEscape must be booleans.");
    }

    this.closeOutside = closeOutside;
    this.closeEscape = closeEscape;

    if (
      typeof stateAttr !== "string" ||
      !stateAttr.trim() ||
      stateAttr.toLowerCase() === "aria-expanded"
    ) {
      throw new Error(
        "Toggle stateAttr must be a valid, non-ARIA state attribute.",
      );
    }

    this.stateAttr = stateAttr;

    if (
      (onOpen !== null && typeof onOpen !== "function") ||
      (onClose !== null && typeof onClose !== "function")
    ) {
      throw new Error("Toggle callbacks must be functions or null.");
    }

    this.onOpen = onOpen;
    this.onClose = onClose;

    this.destroyed = false;

    this.originalExpanded = this.triggerEl.getAttribute("aria-expanded");
    this.originalState = this.panelEl.getAttribute(this.stateAttr);

    if (initialState !== null && !["open", "closed"].includes(initialState)) {
      throw new Error('Toggle initialState must be "open", "closed", or null.');
    }

    const isOpen =
      initialState === null
        ? this.triggerEl.getAttribute("aria-expanded") === "true"
        : initialState === "open";

    this.setState(isOpen);

    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    document.addEventListener("click", this.handleClick);
    document.addEventListener("keydown", this.handleKeydown);
  }

  getTrigger(trigger) {
    const element =
      typeof trigger === "string" ? document.querySelector(trigger) : trigger;

    if (!(element instanceof Element)) {
      throw new Error("Toggle trigger must be a valid DOM Element.");
    }

    return element;
  }

  getPanel(panel) {
    const element =
      typeof panel === "string" ? document.querySelector(panel) : panel;

    if (!(element instanceof Element)) {
      throw new Error("Toggle panel must be a valid DOM Element.");
    }

    return element;
  }

  syncState(state = null) {
    const trigger = this.triggerEl;
    const panel = this.panelEl;

    if (!trigger || !panel) return false;

    const isOpen =
      state === null
        ? trigger.getAttribute("aria-expanded") === "true"
        : Boolean(state);

    trigger.setAttribute("aria-expanded", String(isOpen));
    panel.setAttribute(this.stateAttr, isOpen ? "open" : "closed");

    return isOpen;
  }

  setState(state, callback = true) {
    if (this.destroyed) return this;

    const isOpen = state === "open" || state === true;
    const wasOpen = this.isOpen();

    this.syncState(isOpen);

    if (wasOpen === isOpen) return this;

    if (callback) {
      if (isOpen) {
        this.onOpen?.(this);
      } else {
        this.onClose?.(this);
      }
    }

    return this;
  }

  handleClick(event) {
    if (this.destroyed) return;

    const trigger = this.triggerEl;
    const panel = this.panelEl;
    const target = event.target;

    if (!trigger || !panel || !(target instanceof Node)) return;

    if (trigger === target || trigger.contains(target)) {
      this.toggle();
      return;
    }

    if (this.closeOutside && !panel.contains(target)) {
      this.close();
    }
  }

  handleKeydown(event) {
    if (
      !this.destroyed &&
      this.closeEscape &&
      this.isOpen() &&
      event.key === "Escape"
    ) {
      this.close();
    }
  }

  open() {
    return this.setState("open");
  }

  close() {
    return this.setState("closed");
  }

  toggle() {
    return this.isOpen() ? this.close() : this.open();
  }

  isOpen() {
    const trigger = this.triggerEl;
    return trigger?.getAttribute("aria-expanded") === "true";
  }

  destroy() {
    if (this.destroyed) return;

    document.removeEventListener("click", this.handleClick);
    document.removeEventListener("keydown", this.handleKeydown);

    const trigger = this.triggerEl;
    const panel = this.panelEl;

    if (trigger) {
      if (this.originalExpanded === null) {
        trigger.removeAttribute("aria-expanded");
      } else {
        trigger.setAttribute("aria-expanded", this.originalExpanded);
      }
    }

    if (panel) {
      if (this.originalState === null) {
        panel.removeAttribute(this.stateAttr);
      } else {
        panel.setAttribute(this.stateAttr, this.originalState);
      }
    }

    this.destroyed = true;
  }
}
