import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { artRouter } from './routes/art';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', artRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[server] unhandled error', error);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = Number(process.env.PORT) || 4000;

app.listen(port, () => {
  console.log(`[server] listening on port ${port}`);
});
