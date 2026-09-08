const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/hives - Fetch all registered hives
router.get('/', (req, res) => {
  try {
    const hives = db.getAllHives();
    res.json({ success: true, hives });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/hives - Register a new hive
router.post('/', (req, res) => {
  try {
    const { beekeeperName, apiaryName, location, stateCode, floraType, gpsCoords, activeHives } = req.body;

    if (!beekeeperName || !apiaryName || !location || !stateCode) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: beekeeperName, apiaryName, location, stateCode'
      });
    }

    const newHive = db.createHive({
      beekeeperName,
      apiaryName,
      location,
      stateCode: stateCode.toUpperCase(),
      floraType: floraType || 'Wildflower Nectar',
      gpsCoords: gpsCoords || '12.9716° N, 77.5946° E',
      activeHives: parseInt(activeHives) || 10
    });

    res.status(201).json({ success: true, hive: newHive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
