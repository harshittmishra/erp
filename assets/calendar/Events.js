export default class Events {
  constructor() {
    this.listeners = new Map();
  }

  on(event, handler) {
    if (typeof handler !== "function") {
      throw new TypeError("handler must be a function.");
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event).add(handler);

    return this;
  }

  off(event, handler) {
    const listeners = this.listeners.get(event);

    if (!listeners) {
      return this;
    }

    listeners.delete(handler);

    if (listeners.size === 0) {
      this.listeners.delete(event);
    }

    return this;
  }

  emit(event, ...args) {
    const listeners = this.listeners.get(event);

    if (!listeners) {
      return this;
    }

    for (const handler of listeners) {
      handler(...args);
    }

    return this;
  }
}
