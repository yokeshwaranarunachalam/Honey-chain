const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const seedDatabase = require('./seed');

const hiveRoutes = require('./routes/hiveRoutes');
const batchRoutes = require('./routes/batchRoutes');
const labRoutes = require('./routes/labRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server (port 5173 / any origin)
app.use(cors());
app.use(express.json());

// Auto-seed database if empty
const existingBatches = db.getAllBatches();
if (!existingBatches || existingBatches.length === 0) {
  console.log('🌱 First time startup detected! Seeding database...');
  seedDatabase();
}

// API Routes
app.use('/api/hives', hiveRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/admin', adminRoutes);

// IPFS simulated Gateway Endpoint
app.use('/ipfs', express.static(path.join(__dirname, 'uploads/ipfs_store')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Honey Chain Blockchain API',
    timestamp: new Date().toISOString(),
    sih: 'SIH 2026 - Problem SIH26021 (Team Hive and seek)'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🐝 HONEY CHAIN BACKEND SERVER RUNNING ON PORT ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`=======================================================`);
});
