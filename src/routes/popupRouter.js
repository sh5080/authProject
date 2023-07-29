import express from 'express';
import { sendPopup, clearPopup } from '../controllers/popupController.js';
const router = express.Router();

router.post('/clear', clearPopup);
router.get('/send', sendPopup);

export default router;
