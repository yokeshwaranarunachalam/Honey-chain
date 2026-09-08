const express = require('express');
const router = express.Router();
const db = require('../db');
const { createGenesisBlock, createEventBlock, verifyChainIntegrity } = require('../services/blockchainService');

// Helper to generate professional Batch ID format: e.g. HC-2026-KA-00417
function generateBatchId(stateCode) {
  const year = new Date().getFullYear();
  const state = (stateCode || 'IN').toUpperCase();
  const sequence = Math.floor(100 + Math.random() * 9000);
  return `HC-${year}-${state}-00${sequence}`;
}

// GET /api/batches - List all batches
router.get('/', (req, res) => {
  try {
    const batches = db.getAllBatches();
    res.json({ success: true, batches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/batches/:id - Get detailed batch info with hash trail & lab results
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    let batch = db.getBatchById(id);

    // If not found by batchId, search by block hash
    if (!batch) {
      const allBlocks = db.getAllBlocks();
      const matchingBlock = allBlocks.find(b => b.hash === id);
      if (matchingBlock) {
        batch = db.getBatchById(matchingBlock.batchId);
      }
    }

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const hive = db.getHiveById(batch.hiveId);
    const labReport = db.getLabReportByBatchId(batch.batchId);
    const blocks = db.getBlocksForBatch(batch.batchId);
    const chainIntegrity = verifyChainIntegrity(blocks);

    res.json({
      success: true,
      batch: {
        ...batch,
        hive,
        labReport,
        blocks,
        chainIntegrity
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/batches - Create a new harvest batch & initialize Genesis + Harvest blocks
router.post('/', (req, res) => {
  try {
    const { hiveId, harvestDate, quantityKg, notes } = req.body;

    const hive = db.getHiveById(hiveId);
    if (!hive) {
      return res.status(404).json({ success: false, message: 'Associated Hive not found' });
    }

    const batchId = generateBatchId(hive.stateCode);

    // Step 1: Genesis Block
    const genesisBlock = createGenesisBlock(batchId, hive.beekeeperName, hive.id);
    db.addBlock(genesisBlock);

    // Step 2: Harvest Event Block
    const harvestBlock = createEventBlock([genesisBlock], 'HARVEST_LOGGED', {
      batchId,
      beekeeperName: hive.beekeeperName,
      apiaryName: hive.apiaryName,
      location: hive.location,
      harvestDate: harvestDate || new Date().toISOString().split('T')[0],
      quantityKg: parseFloat(quantityKg) || 100,
      notes: notes || 'Honey harvest logged by beekeeper.'
    });
    db.addBlock(harvestBlock);

    const newBatch = {
      id: batchId,
      batchId,
      hiveId: hive.id,
      beekeeperName: hive.beekeeperName,
      apiaryName: hive.apiaryName,
      location: hive.location,
      stateCode: hive.stateCode,
      floraType: hive.floraType,
      gpsCoords: hive.gpsCoords,
      harvestDate: harvestDate || new Date().toISOString().split('T')[0],
      quantityKg: parseFloat(quantityKg) || 100,
      notes: notes || 'Honey harvest logged by beekeeper.',
      status: 'PENDING',
      latestBlockHash: harvestBlock.hash,
      ipfsCid: null,
      labValidation: null,
      createdAt: new Date().toISOString()
    };

    db.createBatch(newBatch);

    res.status(201).json({
      success: true,
      batch: newBatch,
      blocks: [genesisBlock, harvestBlock]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
