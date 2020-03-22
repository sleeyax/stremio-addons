import addonRouter from './addon';
import express from 'express';
import cors from 'cors';
const port = 1337;

const app = express();

app.disable('etag');

app.use(addonRouter);

app.listen(port, () => console.log(`Listening on http://127.0.0.1:${port}`));
