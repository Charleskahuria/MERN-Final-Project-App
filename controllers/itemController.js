import Item from '../models/Item.js';
import { validationResult } from 'express-validator';

export const getItems = async (req, res) => {
  try {
    // Optional pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Optional filtering
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.keyword) {
      filter.$or = [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    // Check if user is authenticated and is admin, otherwise default to basic view
    let items;
    if (req.user && req.user.role === 'admin') {
      items = await Item.find(filter).sort({ createdAt: -1 }).skip(startIndex).limit(limit).populate('createdBy', 'name email');
    } else {
      items = await Item.find(filter).select('-createdBy').sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    }
    
    const total = await Item.countDocuments(filter);

    res.status(200).json({ 
      success: true, 
      count: items.length, 
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: items 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Assign admin ID to item
    req.body.createdBy = req.user._id;

    const newItem = await Item.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({ success: false, errors: errors.array() });
    }

    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
     res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
