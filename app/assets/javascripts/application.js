//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here


})



new MOJFrontend.MultiFileUpload({
  container: document.querySelector(".moj-multi-file-upload"),
  uploadUrl: "/ajax-upload",
  deleteUrl: "/ajax-delete",
});