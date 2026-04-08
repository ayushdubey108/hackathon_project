import { Router } from 'express';

const router = Router();

import analyzeUser  from '../controllers/analyzeController.js';

router.get('/:username', analyzeUser);

export default router;
