import express from 'express';
import { getStores, addStore } from '../controllers/storeController.js';
const router = express.Router();

router.get('/', getStores);
router.post('/', addStore);

export default router;
