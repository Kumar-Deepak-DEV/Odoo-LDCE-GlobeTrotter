import axios from 'axios';
import { env } from '../../config/env';
import popularCitiesData from '../../config/popularCities.json';

export interface CityData {
  id: string;
  name: string;
  country: string;
  countryCode?: string;
  lat: number;
  lng: number;
  image?: string;
  description?: string;
  popularAttractions?: string[];
  currency?: string;
}

interface GeoDBCityResponseItem {
  id: number;
  wikiDataId?: string;
  city: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  latitude: number;
  longitude: number;
  population?: number;
}

const staticCities: CityData[] = popularCitiesData as CityData[];

export class GeoDBService {
  /**
   * Return the static popular cities list (PRD §7: server/src/config/popularCities.json)
   */
  public static getPopularCities(): CityData[] {
    return staticCities;
  }

  /**
   * Search cities using GeoDB Cities API with seamless fallback to static JSON
   */
  public static async searchCities(query: string, limit: number = 10): Promise<CityData[]> {
    const trimmedQuery = query.trim().toLowerCase();

    // If GeoDB API key is configured, attempt external API search
    if (env.GEODB_API_KEY) {
      try {
        const response = await axios.get<{ data: GeoDBCityResponseItem[] }>(
          `https://${env.GEODB_HOST}/v1/geo/cities`,
          {
            params: {
              namePrefix: trimmedQuery,
              limit: limit,
              sort: '-population',
            },
            headers: {
              'X-RapidAPI-Key': env.GEODB_API_KEY,
              'X-RapidAPI-Host': env.GEODB_HOST,
            },
            timeout: 3500, // 3.5s timeout for fast responsiveness
          }
        );

        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          return response.data.data.map((item) => {
            const matchedStatic = staticCities.find(
              (c) => c.name.toLowerCase() === item.name.toLowerCase()
            );

            return {
              id: `${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${item.countryCode.toLowerCase()}`,
              name: item.city || item.name,
              country: item.country,
              countryCode: item.countryCode,
              lat: item.latitude,
              lng: item.longitude,
              image:
                matchedStatic?.image ||
                `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80`,
              description:
                matchedStatic?.description || `Explore the sights and culture of ${item.name}, ${item.country}.`,
              popularAttractions: matchedStatic?.popularAttractions || [],
            };
          });
        }
      } catch (err) {
        console.warn('GeoDB API search error, falling back to local dataset:', (err as Error).message);
      }
    }

    // Fallback: Filter local static popular cities
    return this.fallbackSearch(trimmedQuery, limit);
  }

  /**
   * Filter local static JSON data
   */
  private static fallbackSearch(query: string, limit: number = 10): CityData[] {
    if (!query) {
      return staticCities.slice(0, limit);
    }

    const filtered = staticCities.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.country.toLowerCase().includes(query) ||
        c.popularAttractions?.some((att) => att.toLowerCase().includes(query))
    );

    return filtered.slice(0, limit);
  }
}
