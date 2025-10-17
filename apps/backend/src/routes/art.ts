import { Router } from 'express';
import { metApi } from '../clients/metClient';
import { parseSearchParams, searchArtworks } from '../services/searchService';
import { getArtwork } from '../services/artworkService';

const router = Router();

router.get('/search', async (req, res, next) => {
  try {
    const params = parseSearchParams(req.query as Record<string, unknown>);

    if (!params.query) {
      return res.status(400).json({ error: 'Missing required query param: q' });
    }

    const result = await searchArtworks(params);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/objects/:id', async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);

    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: 'Invalid object ID' });
    }

    const object = await getArtwork(id);

    res.json(object);
  } catch (error) {
    next(error);
  }
});

router.get('/departments', async (_req, res, next) => {
  try {
    const departments = await metApi.listDepartments();

    res.json(departments);
  } catch (error) {
    next(error);
  }
});

export const artRouter = router;
