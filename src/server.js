import express from 'express';
import plannerRoute from './api/agents/planner.js';
import orchestratorRoute from './api/agents/orchestrator.js';

const app = express();
app.use(express.json());
app.use('/api/agents/planner', plannerRoute);
app.use('/api/agents/orchestrator', orchestratorRoute);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
