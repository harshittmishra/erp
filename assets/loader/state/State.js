import BaseLoader from "../BaseLoader.js";
import StateOptions from "./StateOptions.js";

export default class State extends BaseLoader {

    constructor(options) {
        super(options);

        this.typeOptions = new StateOptions(options.state);
    }

    show() {
        this.options.mount.classList.add(this.typeOptions.className);
    }

    hide() {
        this.options.mount.classList.remove(this.typeOptions.className);
    }

    destroy() {
        this.hide();
        super.destroy();
    }
}