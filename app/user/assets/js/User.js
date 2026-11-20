import DropUpload from "assets/dropUpload/DropUpload.js";

export default class User {
  constructor() {
    this.initProfileUpload();
  }

  initProfileUpload() {
    const dropUpload = new DropUpload({
      mount: "#avatar-uploader",
      viewMode: "tile",
      previewContainer: "#avatar-container",
      allowedMimes: ["image/png", "image/jpeg"],
      hideOnFile: true,
      onCaptured(files) {
        console.log("Captured:", files);
        // upload files using FormData.
      },
    });
  }
}
