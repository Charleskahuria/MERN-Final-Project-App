import Claim from '../models/Claim.js';
import Item from '../models/Item.js';
import { validationResult } from 'express-validator';

export const getClaims = async (req, res) => {
  try {
    // Both Admin and Client might need to get claims
    // Admin gets all, client gets only theirs
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.userId = req.user._id;
    }

    const claims = await Claim.find(filter)
      .populate('itemId', 'title status')
      .populate('userId', 'name email');
    res.status(200).json({ success: true, count: claims.length, data: claims });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const createClaim = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({ success: false, errors: errors.array() });
    }

    req.body.userId = req.user._id;

    // Check if item exists
    const item = await Item.findById(req.body.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    // Check if it's already claimed
    if (item.status === 'claimed') {
        return res.status(400).json({ success: false, message: 'Item is already claimed' });
    }

    // Ensure the client didn't already submit a claim for this item
    const existingClaim = await Claim.findOne({ itemId: req.body.itemId, userId: req.user._id });
    if(existingClaim) {
        return res.status(400).json({ success: false, message: 'You have already placed a claim for this item' });
    }

    const newClaim = await Claim.create(req.body);
    res.status(201).json({ success: true, data: newClaim });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

export const updateClaimStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    // Prevent multiple approvals
    if (claim.status === 'approved') {
        return res.status(400).json({ success: false, message: 'Claim is already approved. Cannot change status.' });
    }

    // Check if item was claimed by another claim
    const item = await Item.findById(claim.itemId);
    if(item.status === 'claimed' && status === 'approved') {
        return res.status(400).json({ success: false, message: 'This item has already been successfully claimed by someone else.' });
    }

    claim.status = status;
    await claim.save();

    // If approved, update item status to claimed
    if (status === 'approved') {
      item.status = 'claimed';
      await item.save();
      
      // Bonus: Reject all other pending claims for this item automatically
      await Claim.updateMany({ itemId: claim.itemId, _id: { $ne: claim._id } }, { status: 'rejected' });
    }

    res.status(200).json({ success: true, data: claim });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
