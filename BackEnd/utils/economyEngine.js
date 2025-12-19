const Asset = require('../models/Asset');
const User = require('../models/User');
const Notification = require('../models/Notification');

const updateAssetPrices = async (io, userSockets) => {
  console.log('Running economy engine: Updating asset prices...');

  const assets = await Asset.find();
  const priceChangePercentage = 0.01; // 1%

  for (const asset of assets) {
    const oldPrice = asset.price;
    let newPrice = oldPrice;
    let changeFactor = 0;

    switch (asset.priceBehavior) {
      case 'appreciate':
        changeFactor = 1 + priceChangePercentage;
        break;
      case 'depreciate':
        changeFactor = 1 - priceChangePercentage;
        break;
      case 'fluctuate':
        // 50/50 chance to appreciate or depreciate
        changeFactor = Math.random() < 0.5 ? 1 + priceChangePercentage : 1 - priceChangePercentage;
        break;
      case 'stable':
      default:
        continue; // Skip stable assets
    }

    newPrice = Math.round(oldPrice * changeFactor);
    asset.price = newPrice;
    await asset.save();

    // If the asset is owned by a user, update their net worth
    if (asset.owner) {
      const priceDifference = newPrice - oldPrice;
      // When an asset's value changes, it affects the user's total net worth.
      // The rfcBalance should only change on a sale, not on a price fluctuation.
      await User.findByIdAndUpdate(asset.owner, { $inc: { netWorth: priceDifference } });

      let message = '';
      let type = 'info';

      if (priceDifference > 0) {
        message = `Your asset '${asset.name}' increased in value by ${priceDifference.toLocaleString()} RFC!`;
        type = 'success';
      } else if (priceDifference < 0) {
        message = `Your '${asset.name}' lost RFC ${Math.abs(priceDifference).toLocaleString()} in value.`;
        type = 'error';
      }

      if (message) {
        // Save the notification to the database
        await Notification.create({
          user: asset.owner,
          message,
          type,
        });

        // Find the owner's socket to send a real-time notification if they are online
        const ownerSocketId = userSockets[asset.owner.toString()];
        if (ownerSocketId) {
          io.to(ownerSocketId).emit('netWorthUpdate', { message, type, newNetWorth: priceDifference });
        }
      }
    }
  }

  console.log('Economy engine: Asset price update complete.');
};

const distributeIncome = async (io, userSockets) => {
  console.log('Running economy engine: Distributing asset income...');

  // Find all assets that generate income and are owned by a user
  const incomeAssets = await Asset.find({ generatesIncome: true, owner: { $ne: null } });

  for (const asset of incomeAssets) {
    // Calculate income based on the asset's current price and its yield percentage
    const incomeGenerated = Math.max(1, Math.round(asset.price * (asset.incomeYieldPercentage / 100)));

    if (incomeGenerated > 0) {
      // Add the income to the owner's RFC balance and net worth
      await User.findByIdAndUpdate(asset.owner, {
        $inc: { rfcBalance: incomeGenerated, netWorth: incomeGenerated },
      });

      // Create a notification for the user
      const message = `Your asset '${asset.name}' generated ${incomeGenerated.toLocaleString()} RFC!`;
      await Notification.create({
        user: asset.owner,
        message,
        type: 'success',
      });

      // Send a real-time notification if the user is online
      const ownerSocketId = userSockets[asset.owner.toString()];
      if (ownerSocketId) {
        io.to(ownerSocketId).emit('incomeReceived', {
          message,
          assetName: asset.name,
          amount: incomeGenerated,
        });
      }
    }
  }

  console.log('Economy engine: Asset income distribution complete.');
};

const startEconomyEngine = (io, userSockets) => {
  // Run price updates every 15 minutes
  setInterval(() => updateAssetPrices(io, userSockets), 15 * 60 * 1000);

  // Run income distribution every 5 minutes
  setInterval(() => distributeIncome(io, userSockets), 5 * 60 * 1000);
};

module.exports = { startEconomyEngine };