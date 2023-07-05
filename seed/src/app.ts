import express from 'express';
import cors from 'cors';
import router from './router';

const app = express();

app.use(cors()); // Accept all requests from any origin - TODO: This should be adapted to our needs
app.use('/', router);

export default app;
