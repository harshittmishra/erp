import Options from "./Options.js";

export default class DropUpload {
  constructor(options = {}) {
    this.options = new Options(options);

    this.element = this.options.mount;
    this.files = [];

    this.dragCounter = 0;
    this.fileId = 0;
    this.previewItems = new Map();

    this.buildStructure();
    this.buildPreviewContainer();
    this.bindEvents();
  }

  buildStructure() {
    // Find existing input or create one.
    this.input = this.element.querySelector('input[type="file"]');

    if (!this.input) {
      this.input = document.createElement("input");
      this.input.type = "file";
      this.input.hidden = true;

      this.element.appendChild(this.input);

      this.generatedInput = true;
    }

    // Configure input
    this.input.multiple = this.options.multiple;

    if (this.options.allowedMimes.length) {
      this.input.accept = this.options.allowedMimes.join(",");
    } else {
      this.input.removeAttribute("accept");
    }

    // Find existing button or create one.
    this.button = this.element.querySelector("button");

    if (!this.button) {
      this.button = document.createElement("button");

      this.button.type = "button";
      this.button.className = "button primary";
      this.button.textContent = "Browse files";

      this.element.appendChild(this.button);

      this.generatedButton = true;
    }

    // Open native file picker
    this.handleBrowse = () => {
      if (!this.options.disabled) {
        this.input.click();
      }
    };

    // Capture selected files
    this.handleInputChange = () => {
      const files = this.input.files;

      if (files?.length) {
        try {
          this.addFiles(files);
        } finally {
          this.input.value = "";
        }
      }
    };

    this.button.addEventListener("click", this.handleBrowse);
    this.input.addEventListener("change", this.handleInputChange);
  }

  buildPreviewContainer() {
    this.previewContainer = this.options.previewContainer;

    if (!this.previewContainer) {
      return;
    }

    this.previewContainer.classList.add("files-container");

    this.previewContainer.classList.remove("list", "tile");

    this.previewContainer.classList.add(this.options.viewMode);
  }

  bindEvents() {
    this.handleDragEnter = (event) => {
      event.preventDefault();

      this.dragCounter++;

      if (this.dragCounter === 1) {
        this.options.onDragStart?.(event);
      }
    };

    this.handleDragOver = (event) => {
      event.preventDefault();

      const files = event.dataTransfer?.items;

      const valid = Array.from(files || []).every((item) => {
        return (
          item.kind === "file" &&
          (!this.options.allowedMimes.length ||
            this.options.allowedMimes.includes(item.type.toLowerCase()))
        );
      });

      event.dataTransfer.dropEffect = valid ? "copy" : "none";
    };

    this.handleDragLeave = (event) => {
      event.preventDefault();

      this.dragCounter = Math.max(0, this.dragCounter - 1);

      if (this.dragCounter === 0) {
        this.options.onDragCompleted?.(event);
      }
    };

    this.handleDrop = (event) => {
      event.preventDefault();

      this.dragCounter = 0;

      this.options.onDragCompleted?.(event);

      const files = event.dataTransfer?.files;

      if (files?.length) {
        this.addFiles(files);
      }
    };

    this.element.addEventListener("dragenter", this.handleDragEnter);
    this.element.addEventListener("dragover", this.handleDragOver);
    this.element.addEventListener("dragleave", this.handleDragLeave);
    this.element.addEventListener("drop", this.handleDrop);
  }

  addFiles(fileList) {
    const validFiles = [];
    const rejectedFiles = [];

    Array.from(fileList).forEach((file) => {
      if (
        this.options.allowedMimes.length &&
        !this.options.allowedMimes.includes(file.type.toLowerCase())
      ) {
        rejectedFiles.push({
          file,
          reason: "INVALID_MIME",
        });

        return;
      }

      if (file.size > this.options.maxFileSize) {
        rejectedFiles.push({
          file,
          reason: "FILE_TOO_LARGE",
        });

        return;
      }

      if (
        !this.options.allowDuplicates &&
        this.files.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.type === file.type &&
            existing.lastModified === file.lastModified,
        )
      ) {
        rejectedFiles.push({
          file,
          reason: "DUPLICATE",
        });

        return;
      }

      const maxFiles = Math.min(
        this.options.maxFiles,
        this.options.multiple ? Infinity : 1,
      );

      if (this.files.length + validFiles.length >= maxFiles) {
        rejectedFiles.push({
          file,
          reason: "MAX_FILES_EXCEEDED",
        });

        return;
      }

      validFiles.push(file);
    });

    if (rejectedFiles.length) {
      this.options.onRejected?.(rejectedFiles);
    }

    if (!validFiles.length) {
      if (!this.files.length) {
        this.options.onEmpty?.();
      }

      return;
    }

    this.files.push(...validFiles);

    this.updateVisibility();

    validFiles.forEach((file) => {
      this.renderFile(file);
    });

    this.options.onCaptured?.(validFiles);
    this.options.onFilesChange?.(validFiles, "added");
    this.options.onChange?.(this.getFiles());
  }

  renderFile(file) {
    if (!this.previewContainer) {
      return;
    }

    const id = ++this.fileId;

    const item = document.createElement("div");
    item.className = "file-item";
    item.dataset.fileId = id;

    const preview = document.createElement("div");
    preview.className = "preview";

    const info = document.createElement("div");
    info.className = "info";

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = file.name;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${this.formatFileSize(file.size)} · ${this.getFileType(file)}`;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "icon-button no-bg";
    removeButton.setAttribute("aria-label", `Remove ${file.name}`);

    const removeIcon = document.createElement("span");
    removeIcon.className = "icon remove";
    removeButton.appendChild(removeIcon);

    info.append(name, meta);
    item.append(preview, info, removeButton);

    let previewUrl = null;

    // Image preview
    if (file.type.startsWith("image/")) {
      previewUrl = URL.createObjectURL(file);

      const image = document.createElement("img");
      image.src = previewUrl;
      image.alt = file.name;

      preview.appendChild(image);
    } else {
      const icon = document.createElement("span");
      icon.className = `icon ${this.getFileIcon(file)}`;

      preview.appendChild(icon);
    }

    const handleRemove = () => {
      this.removeFile(file);
    };

    removeButton.addEventListener("click", handleRemove);

    this.previewItems.set(id, {
      file,
      element: item,
      previewUrl,
      removeButton,
      handleRemove,
    });

    this.previewContainer.appendChild(item);
  }

  getFileIcon(file) {
    const extension = file.name.split(".").pop().toLowerCase();
    return extension || "file";
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB", "TB"];

    const index = Math.floor(Math.log(bytes) / Math.log(1024));

    const size = bytes / Math.pow(1024, index);

    return `${parseFloat(size.toFixed(2))} ${units[index]}`;
  }

  getFileType(file) {
    const extension = file.name.split(".").pop();

    return extension ? extension.toUpperCase() : "FILE";
  }

  removePreview(file) {
    for (const [id, item] of this.previewItems) {
      if (item.file !== file) continue;

      item.removeButton.removeEventListener("click", item.handleRemove);

      item.element.remove();

      if (item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }

      this.previewItems.delete(id);

      return;
    }
  }

  removeFile(file) {
    const index = this.files.indexOf(file);

    if (index === -1) return;

    const removedFile = this.files[index];

    this.files.splice(index, 1);

    this.updateVisibility();

    this.removePreview(removedFile);

    this.options.onFilesChange?.([removedFile], "removed");
    this.options.onFileRemoved?.(removedFile);
    this.options.onChange?.(this.getFiles());

    if (!this.files.length) {
      this.options.onEmpty?.();
    }
  }

  getFiles() {
    return [...this.files];
  }

  clear() {
    if (!this.files.length) return;

    const removedFiles = [...this.files];

    removedFiles.forEach((file) => {
      this.removePreview(file);
    });

    this.files = [];
    this.updateVisibility();
    this.options.onFilesChange?.(removedFiles, "removed");
    this.options.onEmpty?.();
    this.options.onChange?.([]);
  }

  updateVisibility() {
    if (!this.options.hideOnFile) return;

    this.element.classList.toggle("hidden", this.files.length > 0);
  }

  // Get all captured files
  getFiles() {
    return [...this.files];
  }

  // Get total number of files
  getFileCount() {
    return this.files.length;
  }

  // Check whether files exist
  hasFiles() {
    return this.files.length > 0;
  }

  // Get a file by index
  getFile(index) {
    return this.files[index] ?? null;
  }

  // Get total file size in bytes
  getTotalSize() {
    return this.files.reduce((total, file) => total + file.size, 0);
  }

  // Check whether uploader is empty
  isEmpty() {
    return this.files.length === 0;
  }

  destroy() {
    // Drag events
    this.element.removeEventListener("dragenter", this.handleDragEnter);
    this.element.removeEventListener("dragover", this.handleDragOver);
    this.element.removeEventListener("dragleave", this.handleDragLeave);
    this.element.removeEventListener("drop", this.handleDrop);

    // Browse events
    this.button.removeEventListener("click", this.handleBrowse);
    this.input.removeEventListener("change", this.handleInputChange);

    // Remove generated elements
    if (this.generatedButton) {
      this.button.remove();
    }

    if (this.generatedInput) {
      this.input.remove();
    }

    // Remove previews and release object URLs
    for (const file of [...this.files]) {
      this.removePreview(file);
    }

    this.files = [];
    this.dragCounter = 0;
  }
}
