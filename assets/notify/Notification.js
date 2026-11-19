export default class Notification {
  constructor(options, onDestroy) {
    this.id = crypto.randomUUID();

    this.options = options;
    this.onDestroy = onDestroy;

    this.element = null;

    this.timeoutId = null;
    this.removalId = null;

    this.state = "created";

    this.build();
  }

  build() {
    const notify = document.createElement("div");

    notify.classList.add(
      "notify",
      this.options.type,
      `is-${this.options.category}`,
    );

    notify.append(
      this.buildIcon(),
      this.buildContent(),
      ...this.buildActions(),
      this.buildProgress(),
    );

    this.element = notify;

    if (this.options.on) {
      notify.classList.add("clickable");

      notify.addEventListener("click", (event) => {
        if (
          event.target.closest(".notify-action") ||
          event.target.closest(".notify-close")
        ) {
          return;
        }

        this.options.on(this, event);
      });
    }

    return notify;
  }

  buildIcon() {
    const { icon } = this.options;

    if (!icon) return "";

    const container = document.createElement("span");
    container.classList.add("notify-icon");

    const element = document.createElement("i");
    element.classList.add("icon");

    if (typeof icon === "string") {
      element.classList.add(...icon.trim().split(/\s+/));
    }

    container.append(element);

    return container;
  }

  buildContent() {
    const { title, message } = this.options;

    const content = document.createElement("div");
    content.classList.add("notify-content");

    if (title) {
      const element = document.createElement("strong");
      element.classList.add("notify-title");
      element.textContent = title;
      content.append(element);
    }

    if (message) {
      const element = document.createElement("span");
      element.classList.add("notify-message");
      element.textContent = message;

      if (!title) {
        element.classList.add("no-marg");
      }

      content.append(element);
    }

    return content;
  }

  buildActions() {
    const actions = [];

    if (this.options.action) {
      const action = document.createElement("button");

      action.classList.add("notify-action");
      action.type = "button";
      action.textContent = this.options.action;

      action.addEventListener("click", (event) => {
        event.stopPropagation();
        this.options.onAction?.(this, event);
      });

      actions.push(action);
    }

    if (this.options.dismiss) {
      const close = document.createElement("button");

      close.classList.add("notify-close");
      close.type = "button";
      close.textContent = "×";

      close.addEventListener("click", (event) => {
        event.stopPropagation();

        try {
          this.options.onDismiss?.(this, event);
        } finally {
          this.dismiss();
        }
      });

      actions.push(close);
    }

    return actions;
  }

  buildProgress() {
    const { progress, disappearIn } = this.options;

    if (!progress || disappearIn === Infinity) {
      return "";
    }

    const element = document.createElement("div");
    element.classList.add("notify-progress");

    element.style.setProperty("--notify-duration", `${disappearIn}ms`);

    return element;
  }

  mount(element) {
    if (this.state !== "created") return;

    element.append(this.element);

    this.state = "visible";

    try {
      this.options.onAppear?.(this);
    } finally {
      this.startTimeout();
    }

    this.startTimeout();
  }

  startTimeout() {
    const { disappearIn } = this.options;

    if (disappearIn === Infinity) return;

    const exitDuration = 200;

    this.timeoutId = setTimeout(
      () => {
        this.removalReason = "timeout";
        this.dismiss();
      },
      Math.max(0, disappearIn - exitDuration),
    );
  }

  dismiss() {
    if (this.state !== "visible") return;

    this.state = "leaving";

    this.clearTimeout();

    this.element.classList.add("is-leaving");

    this.removalId = setTimeout(() => {
      this.destroy();
    }, 200);
  }

  clearTimeout() {
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }

  destroy() {
    if (this.state === "destroyed") return;

    this.clearTimeout();
    clearTimeout(this.removalId);

    this.removalId = null;

    this.element.remove();

    this.state = "destroyed";

    if (this.removalReason === "timeout") {
      this.options.onDisappear?.(this);
    }

    this.onDestroy?.(this);
  }
}
