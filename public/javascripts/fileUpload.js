// register plugin before parsing
// const rootStyles = window.getComputedStyle(document.documentElement);

// if (
//   rootStyles.getPropertyValue("--book-cover-width-large") != null &&
//   rootStyles.getPropertyValue("--book-cover-width-large") !== ""
// ) {
//   ready();
// } else {
//   document.getElementById("main-css").addEventListener("load", ready);
// }

FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);

FilePond.setOptions({
  stylePanelAspectRatio: 150 / 100,
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 150,
});

FilePond.parse(document.body);
//img stored in database previously on server
