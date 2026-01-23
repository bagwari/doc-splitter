**PDF Splitter (Node.js + Worker Threads)**

High-performance Node.js utility to split a single combined PDF into multiple PDFs based on page → document type mapping, using Worker Threads for parallel processing.

Designed for scalability, performance, and production usage.

**Features**

Parallel PDF processing using Node.js worker threads
Splits PDFs by document type
Reads source PDF only once
Non-blocking, event-loop safe

**Architecture Overview**
Main Thread
 Load combined PDF (once)
 Load page → docType mapping
 Spawn workers per docType
 Collect generated PDFs


**Each worker:**

Loads shared PDF buffer
Extracts required pages
Generates an output PDF

**Project Structure**
pdf-splitter/
├── input/
│   └── combined.pdf
├── output/
│   └── (generated PDFs)
├── src/
│   ├── main.js        # Orchestrator
│   └── worker.js      # PDF processing worker
├── pageMap.json
├── package.json
└── README.md

**Prerequisites**

Node.js 22.x+
npm 10+

**Installation**
git clone <repo-url>
cd pdf-splitter
npm install

**Input PDF**

Place your combined PDF here:

input/combined.pdf

**Page Mapping (pageMap.json)**

Defines which pages belong to which document type.

{
  "doctype1": [1, 2, ..],
  "doctype2": [3],
  "doctype3": [4, 5, 6,..]
}


**Notes:**

Pages are 1-based
Each key becomes an output PDF
Pages do not need to be contiguous

**▶ Running the Application**
npm start

**Output**
Generated PDFs appear in:
output/
├── doctype1.pdf
├── doctype2.pdf
└── doctype3.pdf
