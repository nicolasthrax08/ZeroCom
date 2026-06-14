import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import researchRouter from './routes/research.js';

const app = express();
const PORT = 3002;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'active', service: 'zerocom-research', port: PORT });
});

app.use('/api/research', researchRouter);

app.listen(PORT, () => {
  console.log(`ZeroCom Research API running on port ${PORT}`);
});
