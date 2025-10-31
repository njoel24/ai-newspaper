import express from 'express';
import { runPlannerAgent } from '../../agents/plannerAgent.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await runPlannerAgent();
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;
