import express from 'express';
import { check } from 'express-validator';
import { getClaims, createClaim, updateClaimStatus } from '../controllers/claimController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getClaims)
  .post(
    protect,
    // "POST /api/claims (client only)"
    authorizeRoles('client'),
    [
      check('itemId', 'Item ID is required').not().isEmpty(),
      check('message', 'Message is required as a string').optional().isString()
    ],
    createClaim
  );

router.route('/:id')
  .put(
    protect,
    // "PUT /api/claims/:id (admin only - approve/reject)"
    authorizeRoles('admin'),
    updateClaimStatus
  );

export default router;
