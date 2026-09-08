const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateLabReport } = require('../services/smartContractValidator');
const { uploadToIPFS } = require('../services/ipfsService');
const { createEventBlock } = require('../services/blockchainService');

// POST /api/lab/submit - Submit lab test report & trigger Smart Contract validation
router.post('/submit', (req, res) => {
  try {
    const { batchId, moisture, hmf, c4Sugars, fgRatio, labName, testedBy, testDate } = req.body;

    if (!batchId || moisture === undefined || hmf === undefined || c4Sugars === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required test parameters: batchId, moisture, hmf, c4Sugars'
      });
    }

    const batch = db.getBatchById(batchId);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch ID not found' });
    }

    const labData = {
      moisture: parseFloat(moisture),
      hmf: parseFloat(hmf),
      c4Sugars: parseFloat(c4Sugars),
      fgRatio: parseFloat(fgRatio || 1.1),
      labName: labName || 'NABL Accredited Testing Facility',
      testedBy: testedBy || 'Quality Assurance Chemist',
      testDate: testDate || new Date().toISOString().split('T')[0]
    };

    // 1. Run Smart Contract FSSAI threshold validation
    const validationResult = validateLabReport(labData);

    // 2. Upload lab report & verification result to simulated IPFS
    const ipfsResult = uploadToIPFS({
      batchId,
      labData,
      validation: validationResult,
      timestamp: new Date().toISOString()
    });

    // 3. Retrieve existing blockchain ledger blocks for this batch
    const existingBlocks = db.getBlocksForBatch(batchId);

    // 4. Create LAB_REPORT_SUBMITTED event block
    const labBlock = createEventBlock(existingBlocks, 'LAB_REPORT_SUBMITTED', {
      batchId,
      ipfsCid: ipfsResult.cid,
      labName: labData.labName,
      testedBy: labData.testedBy,
      testDate: labData.testDate
    });
    db.addBlock(labBlock);

    // 5. Create SMART_CONTRACT_VERIFIED event block
    const updatedBlocks = [...existingBlocks, labBlock];
    const contractBlock = createEventBlock(updatedBlocks, 'SMART_CONTRACT_VERIFIED', {
      batchId,
      status: validationResult.status,
      isVerified: validationResult.isVerified,
      fssaiComplianceScore: validationResult.fssaiComplianceScore,
      violations: validationResult.violationReasons,
      ipfsCid: ipfsResult.cid
    });
    db.addBlock(contractBlock);

    // 6. Save Lab Report in DB
    const labReportRecord = {
      id: `LAB-REP-${batchId}`,
      batchId,
      ...labData,
      validation: validationResult,
      ipfsCid: ipfsResult.cid,
      ipfsGatewayUrl: ipfsResult.gatewayUrl,
      createdAt: new Date().toISOString()
    };
    db.saveLabReport(labReportRecord);

    // 7. Update Batch record with validation status, latest block hash & IPFS CID
    const updatedBatch = db.updateBatch(batchId, {
      status: validationResult.status,
      latestBlockHash: contractBlock.hash,
      ipfsCid: ipfsResult.cid,
      labValidation: validationResult
    });

    res.json({
      success: true,
      batch: updatedBatch,
      labReport: labReportRecord,
      validation: validationResult,
      ipfs: ipfsResult,
      blocks: [labBlock, contractBlock]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
