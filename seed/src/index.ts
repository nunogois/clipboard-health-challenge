import { config } from 'dotenv';
import app from './app';
import createLogger from './logger';

config();

const port = process.env.PORT || 5006;

app.listen(port, () => {
  createLogger('index.ts').info(`API listening on http://localhost:${port}`);
});
