import express from 'express';
import { runOrchestratorAgent } from '../../agents/orchestratorAgent.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await runOrchestratorAgent();
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;
