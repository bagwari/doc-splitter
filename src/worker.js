import { parentPort, workerData } from "worker_threads";
import fs from "fs/promises";
import path from "path";
import { PDFDocument } from "pdf-lib";

const { pdfBuffer, docType, pages, outputDir } = workerData;

(async () => {
  try {
    const sourcePdf = await PDFDocument.load(pdfBuffer);
    const newPdf = await PDFDocument.create();

    // Convert to 0-based index
    const pageIndexes = pages.map(p => p - 1);

    const copiedPages = await newPdf.copyPages(
      sourcePdf,
      pageIndexes
    );

    copiedPages.forEach(p => newPdf.addPage(p));

    const pdfBytes = await newPdf.save();

    const outputPath = path.join(outputDir, `${docType}.pdf`);
    await fs.writeFile(outputPath, pdfBytes);

    parentPort.postMessage({
      docType,
      pages,
      status: "success"
    });
  } catch (err) {
    parentPort.postMessage({
      docType,
      status: "error",
      error: err.message
    });
  }
})();
