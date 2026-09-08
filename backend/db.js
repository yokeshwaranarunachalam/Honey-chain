/**
 * Honey Chain - In-Memory & File-Persisted Database Layer
 * 
 * Provides relational table operations for Hives, Batches, Lab Reports, and Blockchain Ledger Blocks.
 * Persists data automatically to a local JSON file so that state survives restarts.
 */

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'honey_chain_db.json');

// Ensure data folder exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const defaultData = {
  hives: [],
  batches: [],
  lab_reports: [],
  blocks: []
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDb(defaultData);
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, using default:', err);
    return defaultData;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

const db = {
  // Hive operations
  getAllHives: () => {
    const data = readDb();
    return data.hives;
  },
  getHiveById: (id) => {
    const data = readDb();
    return data.hives.find(h => h.id === id);
  },
  createHive: (hive) => {
    const data = readDb();
    const newHive = {
      id: `HIVE-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
      ...hive
    };
    data.hives.push(newHive);
    writeDb(data);
    return newHive;
  },

  // Batch operations
  getAllBatches: () => {
    const data = readDb();
    return data.batches;
  },
  getBatchById: (id) => {
    const data = readDb();
    return data.batches.find(b => b.id === id || b.batchId === id);
  },
  createBatch: (batchData) => {
    const data = readDb();
    data.batches.unshift(batchData);
    writeDb(data);
    return batchData;
  },
  updateBatch: (id, updates) => {
    const data = readDb();
    const idx = data.batches.findIndex(b => b.id === id || b.batchId === id);
    if (idx !== -1) {
      data.batches[idx] = { ...data.batches[idx], ...updates, updatedAt: new Date().toISOString() };
      writeDb(data);
      return data.batches[idx];
    }
    return null;
  },

  // Lab Reports
  saveLabReport: (report) => {
    const data = readDb();
    data.lab_reports.unshift(report);
    writeDb(data);
    return report;
  },
  getLabReportByBatchId: (batchId) => {
    const data = readDb();
    return data.lab_reports.find(r => r.batchId === batchId);
  },

  // Blockchain Blocks
  addBlock: (block) => {
    const data = readDb();
    data.blocks.push(block);
    writeDb(data);
    return block;
  },
  getBlocksForBatch: (batchId) => {
    const data = readDb();
    return data.blocks.filter(b => b.batchId === batchId);
  },
  getAllBlocks: () => {
    const data = readDb();
    return data.blocks;
  },

  // Reset / Seed helper
  resetData: (initialData) => {
    writeDb(initialData);
  }
};

module.exports = db;
