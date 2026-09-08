/**
 * Honey Chain - Database Seeder Script
 * Pre-populates realistic data for SIH 2026 judging walkthrough.
 */

const db = require('./db');
const { validateLabReport } = require('./services/smartContractValidator');
const { createGenesisBlock, createEventBlock } = require('./services/blockchainService');
const { uploadToIPFS } = require('./services/ipfsService');

function seedDatabase() {
  console.log('🐝 Seeding Honey Chain Database with realistic SIH 2026 batches...');

  const hives = [
    {
      id: 'HIVE-KA-101',
      beekeeperName: 'Ramesh Gowda',
      apiaryName: 'Coorg Valley Apiaries',
      location: 'Madikeri, Coorg, Karnataka',
      stateCode: 'KA',
      floraType: 'Wild Eucalyptus & Coffee Nectar',
      gpsCoords: '12.4244° N, 75.7382° E',
      activeHives: 24,
      registeredAt: '2025-11-10T08:30:00Z'
    },
    {
      id: 'HIVE-PB-204',
      beekeeperName: 'Harpreet Singh',
      apiaryName: 'Doaba Mustard Apiaries',
      location: 'Jalandhar, Punjab',
      stateCode: 'PB',
      floraType: 'Mustard Blossom',
      gpsCoords: '31.3260° N, 75.5762° E',
      activeHives: 40,
      registeredAt: '2025-12-01T09:15:00Z'
    },
    {
      id: 'HIVE-HP-309',
      beekeeperName: 'Sunita Sharma',
      apiaryName: 'Himalayan Organic Flora',
      location: 'Kullu Valley, Himachal Pradesh',
      stateCode: 'HP',
      floraType: 'Wild Mountain Wildflower & Acacia',
      gpsCoords: '31.9579° N, 77.1095° E',
      activeHives: 18,
      registeredAt: '2026-01-15T10:00:00Z'
    },
    {
      id: 'HIVE-MH-412',
      beekeeperName: 'Anil Deshmukh',
      apiaryName: 'Sahyadri Honey Farms',
      location: 'Mahabaleshwar, Maharashtra',
      stateCode: 'MH',
      floraType: 'Strawberry & Jamun Blossom',
      gpsCoords: '17.9242° N, 73.6586° E',
      activeHives: 30,
      registeredAt: '2026-02-01T11:20:00Z'
    },
    {
      id: 'HIVE-TN-515',
      beekeeperName: 'Murugan K.',
      apiaryName: 'Palani Hills Beekeeping',
      location: 'Kodaikanal, Tamil Nadu',
      stateCode: 'TN',
      floraType: 'Kurinji & Forest Flora',
      gpsCoords: '10.2381° N, 77.4892° E',
      activeHives: 15,
      registeredAt: '2026-02-12T14:45:00Z'
    },
    {
      id: 'HIVE-WB-620',
      beekeeperName: 'Subhash Mondal',
      apiaryName: 'Sundarbans Wild Honey Coop',
      location: 'Gosaba, Sundarbans, West Bengal',
      stateCode: 'WB',
      floraType: 'Mangrove Khalsi Flower',
      gpsCoords: '22.1652° N, 88.8066° E',
      activeHives: 12,
      registeredAt: '2026-02-20T07:10:00Z'
    }
  ];

  const rawBatches = [
    {
      batchId: 'HC-2026-KA-00417',
      hiveId: 'HIVE-KA-101',
      harvestDate: '2026-02-15',
      quantityKg: 450,
      notes: 'First spring harvest of raw Coorg blossom nectar.',
      labData: {
        moisture: 17.5,
        hmf: 24.0,
        c4Sugars: 1.2,
        fgRatio: 1.18,
        testedBy: 'Dr. A. K. Varma (NABL Accredited Lab, Bengaluru)',
        labName: 'Equinox Food Labs',
        testDate: '2026-02-18'
      }
    },
    {
      batchId: 'HC-2026-PB-00892',
      hiveId: 'HIVE-PB-204',
      harvestDate: '2026-02-20',
      quantityKg: 820,
      notes: 'Bulk mustard harvest. High viscosity.',
      labData: {
        moisture: 22.4, // FAIL > 20%
        hmf: 110.0,    // FAIL > 80
        c4Sugars: 14.5, // FAIL > 7%
        fgRatio: 0.88,  // FAIL < 1.0
        testedBy: 'R. K. Grover',
        labName: 'Punjab Food Safety Analytical Testing Center',
        testDate: '2026-02-22'
      }
    },
    {
      batchId: 'HC-2026-HP-00105',
      hiveId: 'HIVE-HP-309',
      harvestDate: '2026-02-25',
      quantityKg: 280,
      notes: 'Premium high-altitude organic acacia blend.',
      labData: {
        moisture: 16.8,
        hmf: 15.2,
        c4Sugars: 0.5,
        fgRatio: 1.25,
        testedBy: 'Dr. Meera Sen',
        labName: 'Himalayan Bio-Tech Quality Assurances',
        testDate: '2026-02-27'
      }
    },
    {
      batchId: 'HC-2026-MH-00334',
      hiveId: 'HIVE-MH-412',
      harvestDate: '2026-03-01',
      quantityKg: 350,
      notes: 'Mahabaleshwar forest collection. Sample awaiting lab processing.',
      labData: null // PENDING STATE
    },
    {
      batchId: 'HC-2026-TN-00512',
      hiveId: 'HIVE-TN-515',
      harvestDate: '2026-03-02',
      quantityKg: 190,
      notes: 'Kodaikanal mountain flora.',
      labData: {
        moisture: 19.1,
        hmf: 45.0,
        c4Sugars: 12.0, // FAIL C4 Adulteration > 7%
        fgRatio: 1.05,
        testedBy: 'S. Ramanathan',
        labName: 'Southern Regional Food Quality Lab, Chennai',
        testDate: '2026-03-04'
      }
    },
    {
      batchId: 'HC-2026-WB-00620',
      hiveId: 'HIVE-WB-620',
      harvestDate: '2026-03-05',
      quantityKg: 310,
      notes: 'Rare Sundarbans mangrove Khalsi honey harvest.',
      labData: {
        moisture: 18.2,
        hmf: 42.0,
        c4Sugars: 2.1,
        fgRatio: 1.14,
        testedBy: 'Dr. B. Das',
        labName: 'Kolkata Central Food Laboratory',
        testDate: '2026-03-07'
      }
    }
  ];

  const processedBatches = [];
  const processedBlocks = [];
  const processedLabReports = [];

  rawBatches.forEach(raw => {
    const hive = hives.find(h => h.id === raw.hiveId);
    
    // Step 1: Genesis Block (Hive Registration linkage)
    const genesisBlock = createGenesisBlock(raw.batchId, hive.beekeeperName, hive.id);
    processedBlocks.push(genesisBlock);

    // Step 2: Harvest Event Block
    const harvestBlock = createEventBlock([genesisBlock], 'HARVEST_LOGGED', {
      batchId: raw.batchId,
      beekeeperName: hive.beekeeperName,
      apiaryName: hive.apiaryName,
      location: hive.location,
      harvestDate: raw.harvestDate,
      quantityKg: raw.quantityKg,
      notes: raw.notes
    });
    processedBlocks.push(harvestBlock);

    let status = 'PENDING';
    let labValidation = null;
    let ipfsDoc = null;
    let currentHash = harvestBlock.hash;

    if (raw.labData) {
      // Step 3: Run Smart Contract Validation
      labValidation = validateLabReport(raw.labData);
      status = labValidation.status;

      // Step 4: Upload Report metadata to simulated IPFS
      ipfsDoc = uploadToIPFS({
        batchId: raw.batchId,
        labData: raw.labData,
        validation: labValidation,
        timestamp: new Date().toISOString()
      });

      // Step 5: Lab & Smart Contract Event Blocks
      const labBlock = createEventBlock([genesisBlock, harvestBlock], 'LAB_REPORT_SUBMITTED', {
        batchId: raw.batchId,
        ipfsCid: ipfsDoc.cid,
        labName: raw.labData.labName,
        testedBy: raw.labData.testedBy
      });
      processedBlocks.push(labBlock);

      const contractBlock = createEventBlock([genesisBlock, harvestBlock, labBlock], 'SMART_CONTRACT_VERIFIED', {
        batchId: raw.batchId,
        status: labValidation.status,
        isVerified: labValidation.isVerified,
        fssaiScore: labValidation.fssaiComplianceScore,
        violations: labValidation.violationReasons,
        ipfsCid: ipfsDoc.cid
      });
      processedBlocks.push(contractBlock);

      currentHash = contractBlock.hash;

      processedLabReports.push({
        id: `LAB-REP-${raw.batchId}`,
        batchId: raw.batchId,
        ...raw.labData,
        validation: labValidation,
        ipfsCid: ipfsDoc.cid,
        ipfsGatewayUrl: ipfsDoc.gatewayUrl
      });
    }

    processedBatches.push({
      id: raw.batchId,
      batchId: raw.batchId,
      hiveId: hive.id,
      beekeeperName: hive.beekeeperName,
      apiaryName: hive.apiaryName,
      location: hive.location,
      stateCode: hive.stateCode,
      floraType: hive.floraType,
      gpsCoords: hive.gpsCoords,
      harvestDate: raw.harvestDate,
      quantityKg: raw.quantityKg,
      notes: raw.notes,
      status: status,
      latestBlockHash: currentHash,
      ipfsCid: ipfsDoc ? ipfsDoc.cid : null,
      labValidation: labValidation,
      createdAt: new Date().toISOString()
    });
  });

  db.resetData({
    hives: hives,
    batches: processedBatches,
    lab_reports: processedLabReports,
    blocks: processedBlocks
  });

  console.log(`✅ Seeding complete! 6 hives, 6 batches (${processedBatches.filter(b=>b.status==='VERIFIED').length} Verified, ${processedBatches.filter(b=>b.status==='FLAGGED').length} Flagged, ${processedBatches.filter(b=>b.status==='PENDING').length} Pending) loaded.`);
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
