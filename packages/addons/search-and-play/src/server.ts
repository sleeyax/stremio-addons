import addonInterface from './addon';
import { getRouter } from 'stremio-addon-sdk';
import landingTemplate from 'stremio-addon-sdk/src/landingTemplate';
import express from 'express';
import phin from 'phin';
import { port, streamingServerUrl } from './constants';

const app = express();

app.use(getRouter(addonInterface));

// show landing page at root
app.get('/', function(req, res) {
  res.setHeader('content-type', 'text/html');
  res.end(landingTemplate(addonInterface.manifest));
})

// proxy thumbnail images to and from the streaming server
app.get('/:ih/:idx/thumb.*', async (req, res) => {
  const response = await phin(`${streamingServerUrl}${req.path}`);
  res.set(response.headers);
  res.send(response.body);
});

app.listen(port, () => console.log(`Started listening at http://localhost:${port}`));
