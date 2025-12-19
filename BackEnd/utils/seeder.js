const mongoose = require('mongoose');
require('dotenv').config();
const Asset = require('../models/Asset');
const connectDB = require('../db');

// A simple, hardcoded list of assets.
const categories = [
  { name: 'Data Infrastructure', emoji: '🖥️' },
  { name: 'Renewable Energy', emoji: '⚡' },
  { name: 'Logistics & Shipping', emoji: '🚢' },
  { name: 'Biotech Research', emoji: '🧬' },
  { name: 'Vehicles', emoji: '🚗' },
  { name: 'Real Estate', emoji: '🏠' },
];

const priceBuckets = [
  { min: 1, max: 100, count: 20 },
  { min: 1, max: 1000, count: 34 },
  { min: 1000, max: 5000, count: 34 },
  { min: 5000, max: 10000, count: 26 },
  { min: 10000, max: 15000, count: 25 },
  { min: 15000, max: 20000, count: 17 },
  { min: 20000, max: 30000, count: 17 },
  { min: 30000, max: 50000, count: 17 },
];

const namePools = {
  'Data Infrastructure': [...Array(50)].map((_, i) => `Data Asset ${i + 1}`),
  'Renewable Energy': [...Array(50)].map((_, i) => `Energy Asset ${i + 1}`),
  'Logistics & Shipping': [...Array(50)].map((_, i) => `Logistics Asset ${i + 1}`),
  'Biotech Research': [...Array(50)].map((_, i) => `Biotech Asset ${i + 1}`),
  Vehicles: [...Array(50)].map((_, i) => `Vehicle ${i + 1}`),
  'Real Estate': [...Array(50)].map((_, i) => `Property ${i + 1}`),
};

function randomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const assets = [];

priceBuckets.forEach((bucket) => {
  for (let i = 0; i < bucket.count; i++) {
    const category = categories[i % categories.length];
    const price = randomPrice(bucket.min, bucket.max);
    const name = namePools[category.name].shift();

    assets.push({
      name,
      category: category.name,
      emoji: category.emoji,
      price,
      priceBehavior: ['stable', 'appreciate', 'depreciate', 'fluctuate'][i % 4],
    });
  }
});

// Shuffle assets to randomize which ones get income/loss
assets.sort(() => Math.random() - 0.5);

// Total assets counters for behavior
let gainAssetsRemaining = 57;
let loseAssetsRemaining = 38;

assets.forEach((asset) => {
  // Assign behavior
  let generatesIncome = false;
  let losesIncome = false;
  if (gainAssetsRemaining > 0) {
    generatesIncome = true;
    gainAssetsRemaining--;
  } else if (loseAssetsRemaining > 0) {
    losesIncome = true;
    loseAssetsRemaining--;
  }

  // --- Define Income Properties ---
  const incomeYieldPercentage = generatesIncome ? 2 : 0; // 2% yield for income assets
  const incomeAmount = generatesIncome ? Math.max(1, Math.round(asset.price * (incomeYieldPercentage / 100))) : 0;
  const incomeString = `Generates ${incomeAmount.toLocaleString()} RFC every 5 minutes`;

  // --- Build the new description for the frontend ---
  let newDescription = asset.category;
  if (generatesIncome) {
    newDescription += ` - ${incomeString}`;
  }

  asset.description = newDescription;
  asset.generatesIncome = generatesIncome;
  asset.losesIncome = losesIncome;
  asset.incomeYieldPercentage = incomeYieldPercentage;

  if (generatesIncome || losesIncome) {
    asset.incomeIntervalSeconds = 300;
    asset.incomeDetails = generatesIncome ? incomeString : 'Loses RFC every 5 minutes';
  }
});

async function seed() {
  try {
    await connectDB();

    await Asset.deleteMany({});
    console.log('Old assets removed');

    await Asset.insertMany(assets);
    console.log(`Seeded ${assets.length} assets`);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
