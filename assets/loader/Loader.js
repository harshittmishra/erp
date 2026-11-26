import Options from "./Options.js";
import Spinner from "./spinner/Spinner.js";
import State from "./state/State.js";

export default class Loader {
    constructor(rawOptions = {}) {
        this.instances = {};

        this.types = {
            spinner: Spinner,
            state: State,
        };

        const options = new Options(rawOptions);

        this.options = {
            ...options,
            type: this.assessType(options)
        };

        this.originalDisabled = null;
    }

    assessType(options) {

        const allowedTypes = Object.keys(this.types);

        // Explicit type takes priority.
        if (options.type) {

            if (!allowedTypes.includes(options.type)) {
                throw new Error(
                    `Invalid loader type "${options.type}". Allowed types: ${allowedTypes.join(", ")}.`,
                );
            }

            return options.type;
        }

        // Find matching type-specific configurations.
        const matches = allowedTypes.filter(
            key => Object.hasOwn(options, key)
        );

        if (matches.length === 1) {
            return matches[0];
        }

        if (matches.length > 1) {
            throw new Error(
                `Multiple loader configurations found: ${matches.join(", ")}. Specify only one loader type.`,
            );
        }

        throw new Error(
            `Invalid loader type. Allowed types: ${allowedTypes.join(", ")}.`,
        );
    }

    show() {
        let instance = this.instances[this.options.type];

        if (!instance) {
            instance = new this.types[this.options.type](this.options);
            this.instances[this.options.type] = instance;
        }

        if (this.options.shouldDisable) {
            this.originalDisabled = this.options.mount.hasAttribute("disabled");
            this.options.mount.setAttribute("disabled", "");
        }

        instance.show();

        this.options.onShow?.(this, "show");
        this.startTimeout();

        return this;
    }

    startTimeout() {
        // Clear any previously scheduled timeout.
        clearTimeout(this.timeout);

        if (this.options.duration > 0) {
            // Automatically hide after the specified duration.

            this.timeout = setTimeout(() => {
                this.hide();
            }, this.options.duration);
        }
    }

    hide() {
        clearTimeout(this.timeout);
        this.timeout = null;

        const instance = this.instances[this.options.type];

        if (instance) {
            instance.hide();

            if (this.options.shouldDisable) {
                if (!this.originalDisabled) {
                    this.options.mount.removeAttribute("disabled");
                }

                this.originalDisabled = null;
            }

            this.options.onHide?.(this, "hide");
        }

        return this;
    }

}