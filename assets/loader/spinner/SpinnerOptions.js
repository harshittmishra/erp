import OptionsPipeline from "../../options/OptionsPipeline.js";

export default class SpinnerOptions extends OptionsPipeline {

    constructor(options = {}, context) {
        super({
            opacity: 0.5,
            bg: '#fff',
            blur: 0,
            size: 35,
            position: 'center',
            offset: 10,
            overlay: true,
            color: "#3498db",
            trackColor: "rgba(0, 0, 0, 0.15)",
            ...options,
        },
            context
        );

        Object.freeze(this);
    }

    opacity(value) {
        if (typeof value !== "number" || !Number.isFinite(value)) {
            throw new TypeError("opacity must be a valid number.");
        }

        if (value < 0 || value > 1) {
            throw new RangeError("opacity must be between 0 and 1.");
        }

        return value;
    }

    size(value) {
        if (typeof value !== "number" || !Number.isFinite(value)) {
            throw new TypeError("spinnerSize must be a valid number.");
        }

        if (value <= 0) {
            throw new RangeError("spinnerSize must be greater than 0.");
        }

        return value;
    }

    position(value) {
        if (typeof value !== "string") {
            throw new TypeError("spinnerPosition must be a string.");
        }

        const position = value.trim().toLowerCase().replace(/\s+/g, " ");

        if (!this.context.allowedPositions.includes(position)) {
            throw new RangeError(
                `Invalid spinnerPosition "${value}". Allowed positions: ${this.context.allowedPositions.join(", ")}.`,
            );
        }

        return position;
    }

    bg(value) {
        if (typeof value !== "string") {
            throw new TypeError("backgroundColor must be a string.");
        }

        const color = value.trim();

        if (!color) {
            throw new TypeError("backgroundColor cannot be empty.");
        }

        if (
            typeof CSS !== "undefined" &&
            typeof CSS.supports === "function" &&
            !CSS.supports("color", color)
        ) {
            throw new TypeError(`Invalid backgroundColor: "${value}".`);
        }

        return color;
    }

    blur(value) {
        if (typeof value !== "number" || !Number.isFinite(value)) {
            throw new TypeError("blur must be a valid number.");
        }

        if (value < 0) {
            throw new RangeError("blur cannot be negative.");
        }

        return value;
    }

    offset(value) {
        if (typeof value !== "number" || !Number.isFinite(value)) {
            throw new TypeError("spinnerOffset must be a valid number.");
        }

        if (value < 0) {
            throw new RangeError("spinnerOffset cannot be negative.");
        }

        return value;
    }

    overlay(value) {
        if (typeof value !== "boolean") {
            throw new TypeError("overlay must be a boolean.");
        }

        return value;
    }

    validateColor(value, name) {
        if (typeof value !== "string") {
            throw new TypeError(`${name} must be a string.`);
        }

        const color = value.trim();

        if (!color) {
            throw new TypeError(`${name} cannot be empty.`);
        }

        if (
            typeof CSS !== "undefined" &&
            typeof CSS.supports === "function" &&
            !CSS.supports("color", color)
        ) {
            throw new TypeError(`Invalid ${name}: "${value}".`);
        }

        return color;
    }
}