import BaseLoader from "../BaseLoader.js";
import SpinnerOptions from "./SpinnerOptions.js";

export default class Spinner extends BaseLoader {

    constructor(options) {
        super(options);

        this.typeOptions = new SpinnerOptions(
            options.spinner,
            {
                allowedPositions: [
                    "center",
                    "top",
                    "bottom",
                    "left",
                    "right",
                    "top left",
                    "top right",
                    "bottom left",
                    "bottom right"
                ]
            }
        );
    }


    render() {
        if (this.element) {
            return this.element;
        }

        const loader = document.createElement("div");
        loader.className = "loader";

        // Loader styling
        loader.style.setProperty("--loader-opacity", this.typeOptions.opacity);
        loader.style.setProperty("--loader-color", this.typeOptions.bg);
        loader.style.setProperty("--loader-blur", `${this.typeOptions.blur}px`);
        loader.style.setProperty("--spinner-offset", `${this.typeOptions.offset}px`);
        loader.style.setProperty("--spinner-border-color", this.typeOptions.color);
        loader.style.setProperty("--spinner-track-color", this.typeOptions.trackColor);

        // Spinner size
        if (this.typeOptions.size !== undefined) {
            loader.style.setProperty(
                "--spinner-size",
                `${this.typeOptions.size}px`
            );
        }

        // Spinner position
        if (this.typeOptions.position) {
            loader.classList.add(
                ...this.typeOptions.position.split(" ")
            );
        }

        // Background overlay
        if (this.typeOptions.overlay) {
            const overlay = document.createElement("div");
            overlay.className = "overlay";

            loader.appendChild(overlay);
        }

        // Spinner holder
        const holder = document.createElement("div");
        holder.className = "spinner_holder";

        // Spinner
        const spinner = document.createElement("span");
        spinner.className = "spinner";

        // Build DOM structure
        holder.appendChild(spinner);
        loader.appendChild(holder);

        // Mount loader
        this.options.mount.appendChild(loader);

        this.element = loader;

        return loader;
    }

    show() {
        const element = this.render();
        element.hidden = false;
        return this;
    }

    hide() {
        if (this.element) {
            this.element.hidden = true;
        }

        return this;
    }

    destroy() {
        this.element?.remove();
        this.element = null;
        return this;
    }
}