export default class BaseLoader {
    constructor(options) {
        this.options = options;
        this.element = null;
    }

    render() {
        throw new Error("render() must be implemented.");
    }

    update() {
        throw new Error("update() must be implemented.");
    }

    destroy() {
        this.element?.remove();
        this.element = null;
    }
}