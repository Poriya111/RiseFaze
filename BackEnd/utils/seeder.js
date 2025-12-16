const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // Import the path module
const User = require('../models/User.js');
const Asset = require('../models/Asset.js');
const connectDB = require('../db.js');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

connectDB();

const assets = [
  {
    name: 'Downtown Office Block',
    category: 'Real Estate',
    description:
      'A prime piece of commercial real estate generating steady passive income.',
    price: 500000,
    emoji: '🏢',
  },
  {
    name: 'Digital Art NFT',
    category: 'Digital',
    description:
      'A unique piece of digital art whose value fluctuates with market trends.',
    price: 120000,
    emoji: '🎨',
  },
  {
    name: 'Tech Startup Shares',
    category: 'Stocks',
    description: 'Equity in a promising tech startup with high growth potential.',
    price: 300000,
    emoji: '📈',
  },
  {
    name: 'Luxury Sports Car',
    category: 'Vehicles',
    description:
      'A high-performance vehicle that increases your influence and status.',
    price: 250000,
    emoji: '🚗',
  },
  {
    name: 'Solar Farm',
    category: 'Energy',
    description: 'A renewable energy asset providing consistent RFC returns.',
    price: 750000,
    emoji: '⚡️',
  },
];

const importData = async () => {
  try {
    await Asset.deleteMany(); // Clear existing assets
    await Asset.insertMany(assets);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();