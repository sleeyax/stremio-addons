import { Stream } from 'stremio-addon-sdk';
import { getAllStreams } from './streams';
import { Router } from 'express';
import cors from 'cors';
import manifest from './manifest';
import StreamFilter, { extractFilters } from './filter';
import {join} from 'path';

const addonRouter = Router();

addonRouter.use(cors());
addonRouter.get('/', (_, res) => res.sendFile(join(__dirname, '..', 'static', 'index.html')));

addonRouter.get('/:filters?/manifest.json', (req, res) => {
    res.send(req.params.filters ? {
        ...manifest, 
        description: `${manifest.description} Applied filters: ${req.params.filters.replace(/,/g, ', ')}`
    } : manifest);
});

addonRouter.get('/:filters?/stream/:type/:id.json', async (req, res) => {
    const { filters, type, id } = req.params;

    const streams: Stream[] = await getAllStreams(id, type);
    const filter = new StreamFilter(filters ? extractFilters(filters) : null);

    const removeUnknowns = (filters || false) && filters.indexOf('unknown') == -1;

    res.setHeader('Cache-Control', `max-age=${7 * 24 * 3600}, stale-if-error=${7 * 24 * 3600}, public`)
    res.send({ streams: filter.apply(streams, removeUnknowns) });
});

export default addonRouter;

