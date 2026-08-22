import { Request, Response, NextFunction } from 'express';
import { GeoDBService } from './geodb.service';
import { sendSuccess } from '../../utils/response';
import { CitySearchQueryInput, PopularCitiesQueryInput } from './city.schema';

export class CityController {
  /**
   * Get static list of popular cities (PRD §8: GET /api/cities/popular?limit=6)
   */
  public static async getPopularCities(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { limit = 6 } = req.query as unknown as PopularCitiesQueryInput;
      const allPopular = GeoDBService.getPopularCities();
      const cities = allPopular.slice(0, limit);
      sendSuccess(res, { cities, count: cities.length });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Live search cities using GeoDB Cities API proxy with fallback
   */
  public static async searchCities(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { q, limit = 10 } = req.query as unknown as CitySearchQueryInput;
      const cities = await GeoDBService.searchCities(q, limit);
      sendSuccess(res, { query: q, cities, count: cities.length });
    } catch (error) {
      next(error);
    }
  }
}
