import OptionsPipeline from "../options/OptionsPipeline.js";

export default class Options extends OptionsPipeline {
    constructor(options = {}, context) {
        super({
            mount: null,
            autoHide: null,
            onShow: null,
            onHide: null,
            shouldDisable: false,
            ...options,
        },
            context
        );
        Object.freeze(this);
    }

    mount(value) {
        if (value === null) {
            return null;
        }

        if (typeof HTMLElement !== "undefined" && value instanceof HTMLElement) {
            return value;
        }

        if (typeof value === "string") {
            const selector = value.trim();

            if (!selector) {
                throw new TypeError("mount selector cannot be empty.");
            }

            const element = document.querySelector(selector);

            if (element instanceof HTMLElement) {
                return element;
            }

            throw new Error(
                `No HTML element found for mount selector: "${selector}".`,
            );
        }

        throw new TypeError(
            "mount must be a CSS selector string, an HTML element, or null.",
        );
    }

    autoHide(value) {

        if (value === null) {
            return null;
        }

        if (typeof value !== "number" || !Number.isFinite(value)) {
            throw new TypeError("duration must be a valid number.");
        }

        if (value <= 0) {
            throw new RangeError("duration must be greater than 0.");
        }

        return value;
    }

    onHide(value) {
        return this.callback(value, "onComplete");
    }

    onShow(value) {
        return this.callback(value, "onStart");
    }

    callback(value, name = "callback") {
        if (value !== null && typeof value !== "function") {
            throw new TypeError(`${name} must be a function or null.`);
        }

        return value;
    }

    shouldDisable(value) {
        if (typeof value !== "boolean") {
            throw new TypeError("shouldDisable must be a boolean.");
        }

        return value;
    }
}
