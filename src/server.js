import express from 'express';
import plannerRoute from './api/agents/planner.js';

const app = express();
app.use('/api/agents/planner', plannerRoute);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
