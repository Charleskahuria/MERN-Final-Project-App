import express from 'express';
import { check } from 'express-validator';
import { getItems, createItem, updateItem, deleteItem } from '../controllers/itemController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Optional: you might want getItems to optionally read auth token, so we don't 'protect' it rigidly 
// if public viewing is allowed, but we parse user conditionally in controller if they send token.
// Or we just leave it open and handle user in controller (assuming middleware isn't strictly required for getting).
// But let's build the controller to handle both by checking token manually if needed, or we just protect all?
// The prompt says "Clients can view all available items", so unauthenticated view might be okay, or we protect it for logged-in only.
// Let's ensure protect is not breaking public view if that was intended, or we can just require login to view.
// Requirement: "Clients can register normally. Middleware to protect routes." So we will protect it.

router.route('/')
  .get(protect, getItems)
  .post(
    protect,
    authorizeRoles('admin'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('locationFound', 'Location found is required').not().isEmpty(),
      check('dateFound', 'Date found is required').isISO8601(),
      check('imageUrl', 'Please provide a valid image URL').optional({ checkFalsy: true }).isURL()
    ],
    createItem
  );

router.route('/:id')
  .put(protect, authorizeRoles('admin'), updateItem)
  .delete(protect, authorizeRoles('admin'), deleteItem);

export default router;
