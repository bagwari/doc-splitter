import fs from "fs/promises";
import path from "path";
import os from "os";
import { Worker } from "worker_threads";

const INPUT_PDF = "./input/combined.pdf";
const PAGE_MAP_FILE = "./pageMap.json";
const OUTPUT_DIR = "./output";

// Ensure output directory exists
await fs.mkdir(OUTPUT_DIR, { recursive: true });

// Load inputs
const pdfBuffer = await fs.readFile(INPUT_PDF);
const pageMap = JSON.parse(await fs.readFile(PAGE_MAP_FILE, "utf-8"));

const cpuLimit = os.cpus().length;

function runWorker(docType, pages) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./worker.js", import.meta.url),
      {
        workerData: {
          pdfBuffer,
          docType,
          pages,
          outputDir: OUTPUT_DIR
        }
      }
    );

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker exited with code ${code}`));
    });
  });
}

// Spawn workers
const tasks = Object.entries(pageMap).map(
  ([docType, pages]) => runWorker(docType, pages)
);

await Promise.all(tasks);

console.log("All PDFs generated successfully");
