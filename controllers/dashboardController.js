import Item from '../models/Item.js';
import Claim from '../models/Claim.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const totalClaims = await Claim.countDocuments();
    const pendingClaims = await Claim.countDocuments({ status: 'pending' });
    
    // Items by status aggregate
    const lostItems = await Item.countDocuments({ status: 'lost' });
    const foundItems = await Item.countDocuments({ status: 'found' });
    const claimedItems = await Item.countDocuments({ status: 'claimed' });

    res.status(200).json({
      success: true,
      data: {
        totalItems,
        totalClaims,
        pendingClaims,
        itemsByStatus: {
          lost: lostItems,
          found: foundItems,
          claimed: claimedItems
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
