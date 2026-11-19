export default class Positioner {
  constructor(options) {
    this.options = {
      gap: [5],
      ...options,
    };

    this.injectMount();
    this.bindScroll();
  }

  getGaps() {
    const gap = this.options.gap;

    const [top, right, bottom, left] = Array.isArray(gap)
      ? gap.length === 1
        ? [gap[0], gap[0], gap[0], gap[0]]
        : gap.length === 2
          ? [gap[0], gap[1], gap[0], gap[1]]
          : gap.length === 3
            ? [gap[0], gap[1], gap[2], gap[1]]
            : gap.slice(0, 4)
      : [5, 5, 5, 5];

    return { top, right, bottom, left };
  }

  injectMount() {
    const { positionMode, mount, trigger } = this.options;

    if (positionMode === "floating") {
      document.body.append(mount);
      mount.classList.add("floating");
    } else {
      trigger.insertAdjacentElement("afterend", mount);
    }
  }

  show() {
    const { mount, positionMode } = this.options;

    mount.classList.add("active");

    if (positionMode === "floating") {
      this.position();
    }
  }

  hide() {
    this.options.mount.classList.remove("active");
  }

  bindScroll() {
    if (this.options.positionMode !== "floating") {
      return;
    }

    window.addEventListener("scroll", this.handleScroll, true);
    window.addEventListener("resize", this.handleResize);
  }

  handleScroll = () => {
    if (!this.options.mount.classList.contains("active")) {
      return;
    }

    this.position();
  };

  handleResize = () => {
    if (!this.options.mount.classList.contains("active")) {
      return;
    }

    this.position();
  };

  unbindScroll() {
    window.removeEventListener("scroll", this.handleScroll, true);
    window.removeEventListener("resize", this.handleResize);
  }

  position() {
    if (this.options.positionMode !== "floating") {
      return;
    }

    this.positionFloating();
  }

  positionFloating() {
    const { trigger, mount } = this.options;

    const {
      top: gapTop,
      right: gapRight,
      bottom: gapBottom,
      left: gapLeft,
    } = this.getGaps();

    const triggerRect = trigger.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Available space around the trigger.
    const spaceBelow = viewportHeight - triggerRect.bottom - gapBottom;
    const spaceAbove = triggerRect.top - gapTop;

    // Constrain mount dimensions to the viewport.
    mount.style.maxWidth = `calc(100vw - ${gapLeft + gapRight}px)`;
    mount.style.maxHeight = `calc(100vh - ${gapTop + gapBottom}px)`;

    const mountWidth = mount.offsetWidth;
    const mountHeight = mount.offsetHeight;

    // Vertical positioning.
    let top;

    if (spaceBelow >= mountHeight) {
      // Prefer below the trigger.
      top = triggerRect.bottom + gapBottom;
    } else if (spaceAbove >= mountHeight) {
      // Render above the trigger.
      top = triggerRect.top - mountHeight - gapTop;
    } else {
      // Use the side with more available space.
      if (spaceBelow >= spaceAbove) {
        top = triggerRect.bottom + gapBottom;
      } else {
        top = triggerRect.top - mountHeight - gapTop;
      }
    }

    // Keep the mount within vertical viewport boundaries.
    const maxTop = viewportHeight - mountHeight - gapBottom;

    top = Math.max(gapTop, Math.min(top, maxTop));

    // Horizontal positioning.
    let left = triggerRect.left;

    // Prevent right-side overflow.
    if (left + mountWidth > viewportWidth - gapRight) {
      left = viewportWidth - mountWidth - gapRight;
    }

    // Prevent left-side overflow.
    left = Math.max(gapLeft, left);

    mount.style.left = `${left}px`;
    mount.style.top = `${top}px`;
  }

  destroy() {
    this.unbindScroll();

    this.hide();

    const { mount, positionMode, trigger } = this.options;

    if (positionMode === "floating") {
      mount.classList.remove("floating");
      mount.style.removeProperty("left");
      mount.style.removeProperty("top");
      mount.style.removeProperty("max-width");
      mount.style.removeProperty("max-height");

      trigger.insertAdjacentElement("afterend", mount);
    }
  }
}
