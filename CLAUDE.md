# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running

```bash
node src/main.js
```

No build step — this is plain ESM Node.js (`"type": "module"`). Requires Node.js with Worker Threads support (v12+).

## Architecture

The tool splits a single combined PDF into multiple output PDFs in parallel using Node.js Worker Threads.

**Inputs:**
- `input/combined.pdf` — the source PDF to split
- `pageMap.json` — maps each output document name to a list of 1-based page numbers, e.g. `{ "invoice": [1, 2], "receipt": [3] }`

**Output:** `output/{docType}.pdf` for each key in `pageMap.json`

**Concurrency model:**
- `src/main.js` — orchestrator; reads inputs, spawns one Worker Thread per `pageMap` entry, awaits all via `Promise.all`
- `src/worker.js` — worker; receives the full PDF buffer and its page list via `workerData`, uses `pdf-lib` to copy pages into a new document and write it to disk, then posts a result message back to main

Each worker is fully independent — the PDF buffer is passed by value (structured clone) to each thread, so workers never share state.
