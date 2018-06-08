export default function downloadFile(textData, fileName, mimeType='text/plain') {
  function createDownloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    a.remove();
  }

  createDownloadFile(textData, fileName, mimeType);
}