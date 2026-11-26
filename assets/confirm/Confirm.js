import Options from "./Options.js";
import Toggle from "../toggle/Toggle.js";

export default class Confirm {
  constructor(rawOptions) {
    this.options = new Options(rawOptions);
    this.init();
  }

  init() {
    this.buildMount();
    this.buildModal();

    this.initToggle();

    this.bindTriggers();
    this.attachListeners();

    this.mount.append(this.modal);
  }

  buildMount() {
    const existingMount = document.getElementById(this.options.mountId);

    if (existingMount) {
      this.mount = existingMount;
      return;
    }

    this.mount = document.createElement("div");
    this.mount.id = this.options.mountId;

    document.body.appendChild(this.mount);
  }

  buildModal() {
    // Modal root
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.dataset.state = "closed";

    // Dialog
    const dialog = document.createElement("div");
    dialog.className = "dialog modal-sm";

    // Header
    const header = document.createElement("header");
    header.className = "modal-header";

    const heading = document.createElement("h2");
    heading.className = "modal-heading";
    heading.textContent = this.options.title;

    const closeButton = document.createElement("button");
    closeButton.className = "modal-close";
    closeButton.textContent = "×";

    header.append(heading, closeButton);

    // Body
    const body = document.createElement("div");
    body.className = "modal-body";
    body.textContent = this.options.subtitle;

    // Footer
    const footer = document.createElement("footer");
    footer.className = "modal-footer";

    const secondaryButton = document.createElement("button");
    secondaryButton.className = "button secondary";
    secondaryButton.textContent = this.options.secondaryButtonText;

    const primaryButton = document.createElement("button");
    primaryButton.className = "button primary";
    primaryButton.textContent = this.options.primaryButtonText;

    footer.append(secondaryButton, primaryButton);

    // Assemble dialog
    dialog.append(header, body, footer);

    // Assemble modal
    modal.appendChild(dialog);

    this.modal = modal;

    this.modalEles = {
      close: closeButton,
      primary: primaryButton,
      secondary: secondaryButton,
      heading: heading,
      body: body,
    };
  }

  bindTriggers() {
    this.options.on?.forEach((element) => {
      element.addEventListener("click", this.handleTriggerClick);
    });
  }

  handleTriggerClick = (e) => {
    e.stopImmediatePropagation();

    this.activeTrigger = e.currentTarget;

    this.open();
  };

  initToggle() {
    this.toggleInstance = new Toggle({
      panel: this.modal,
      initialState: "closed",
      onOpen: this.onToggleOpen,
    });
  }

  onToggleOpen = () => {
    this.options.onOpen?.(this);
  };

  open() {
    this.toggleInstance.open();
    return this;
  }

  close() {
    this.toggleInstance.close(this);
    return this;
  }

  toggle() {
    this.toggleInstance.toggle();
    return this;
  }

  isOpen() {
    return this.toggleInstance.isOpen();
  }

  attachListeners() {
    this.modalEles.close.addEventListener("click", this.handleClose);
    this.modalEles.primary.addEventListener("click", this.handleConfirmation);
    this.modalEles.secondary.addEventListener("click", this.handleCancel);
  }

  handleClose = () => {
    this.close();
    this.options.onClose?.();
  };

  handleConfirmation = () => {
    this.options.onConfirmation(this.getIds());
  };

  handleCancel = () => {
    this.close();
    this.options.onCancel?.();
  };

  getIds() {
    let ids;

    if (this.options.ids) {
      ids = this.options.ids();
    } else {
      ids = [Number(this.activeTrigger?.dataset.rowid)];
    }

    if (!Array.isArray(ids) || !ids.every(Number.isInteger)) {
      throw new TypeError("IDs must be an array of integers.");
    }

    return ids;
  }
}
