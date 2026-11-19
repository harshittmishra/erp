import Options from "./Options.js";
import Notification from "./Notification.js";

export default class Notify {
  constructor(rawOptions) {
    this.options = new Options(rawOptions);

    this.instances = new Map();

    this.initMount();
  }

  initMount() {
    const { mount, mountId, type } = this.options;

    const className = `${type}-container`;
    const positionClass = this.getPosition();

    if (mountId) {
      let element = document.getElementById(mountId);

      if (!element) {
        element = document.createElement("div");
        element.id = mountId;
        document.body.append(element);
      }

      element.classList.add(className);

      if (positionClass) {
        element.classList.add(positionClass);
      }

      this.mount = element;

      return;
    }

    if (mount instanceof HTMLElement) {
      mount.classList.add(className, positionClass);
      this.mount = mount;

      return;
    }

    throw new Error("Unable to initialize mount element.");
  }

  getPosition() {
    const { type } = this.options;

    const allowedPositions = {
      banner: [],
      snackbar: ["top", "bottom"],
      toast: ["top-left", "top-right", "bottom-left", "bottom-right"],
    };

    const defaultPositions = {
      banner: "",
      snackbar: "bottom",
      toast: "bottom-right",
    };

    const allowed = allowedPositions[type];

    if (!allowed) {
      throw new Error(`Unsupported notification type: ${type}`);
    }

    // Banner doesn't use positional classes.
    if (type === "banner") {
      return "";
    }

    const position = this.options.position || defaultPositions[type];

    if (!allowed.includes(position)) {
      throw new TypeError(
        `Invalid position "${position}" for ${type}. Allowed positions: ${allowed.join(", ")}.`,
      );
    }

    return position;
  }

  mergeOptions(options = {}) {
    const protectedKeys = ["mount", "mountId", "type", "allowedClasses"];

    const merged = {
      ...this.options,
      ...options,
    };

    for (const key of protectedKeys) {
      merged[key] = this.options[key];
    }

    return merged;
  }

  show(options = {}, category = "default") {
    const notification = new Notification(
      this.mergeOptions({
        category,
        ...options,
      }),
      (instance) => {
        this.instances.delete(instance.id);
      },
    );

    this.instances.set(notification.id, notification);

    notification.mount(this.mount);

    return notification;
  }

  dismiss(id) {
    this.instances.get(id)?.dismiss();
  }

  dismissAll() {
    for (const notification of this.instances.values()) {
      notification.dismiss();
    }
  }

  info(options) {
    return this.show(options, "info");
  }

  success(options) {
    return this.show(options, "success");
  }

  warning(options) {
    return this.show(options, "warning");
  }

  error(options) {
    return this.show(options, "error");
  }
}
