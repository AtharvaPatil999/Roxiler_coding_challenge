import express from 'express';
import { submitRating, getStoreRatings } from '../controllers/ratingController.js';
const router = express.Router();

router.post('/', submitRating);
router.get('/:store_id', getStoreRatings);

export default router;
