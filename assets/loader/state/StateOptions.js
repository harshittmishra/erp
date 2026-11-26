import OptionsPipeline from "../../options/OptionsPipeline.js";

export default class StateOptions extends OptionsPipeline {

    constructor(options = {}) {
        super({
            className: "is-loading",
            ...options
        });
    }

    className(value) {
        if (typeof value !== "string" || !value.trim()) {
            throw new TypeError("className must be a non-empty string.");
        }

        return value.trim();
    }
}