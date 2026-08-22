import { Router } from 'express';
import { CityController } from './city.controller';
import { validate } from '../../middleware/validate';
import { citySearchQuerySchema, popularCitiesQuerySchema } from './city.schema';

const router = Router();

// GET /api/cities/popular
router.get(
  '/popular',
  validate({ query: popularCitiesQuerySchema }),
  CityController.getPopularCities
);

// GET /api/cities/search?q=...
router.get(
  '/search',
  validate({ query: citySearchQuerySchema }),
  CityController.searchCities
);

export default router;
