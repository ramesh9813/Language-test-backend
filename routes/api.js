import express from 'express';
import { evaluateWriting, getTodayEvaluations, getHistoryEvaluations } from '../controllers/writingController.js';
import { validateWritingInput } from '../middleware/validation.js';

const router = express.Router();

// Writing evaluation endpoint
router.post('/data', validateWritingInput, evaluateWriting);
router.get('/data/today/:userId', getTodayEvaluations);
router.get('/data/history/:userId', getHistoryEvaluations);

export default router;
