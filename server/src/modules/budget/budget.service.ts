import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/appError';

export interface StopBudgetSummary {
  stopId: string;
  cityName: string;
  country?: string | null;
  order: number;
  budget: number;
  actualCost: number;
  remaining: number;
  isOverBudget: boolean;
  activityCount: number;
}

export interface CategoryBudgetSummary {
  category: string;
  amount: number;
  percentage: number;
  activityCount: number;
}

export interface CostLevelBudgetSummary {
  costLevel: string;
  amount: number;
  activityCount: number;
}

export interface TripBudgetResponse {
  tripId: string;
  tripName: string;
  totalBudget: number;
  totalEstimatedCost: number;
  balance: number;
  isOverBudget: boolean;
  byCategory: CategoryBudgetSummary[];
  byStop: StopBudgetSummary[];
  byCostLevel: CostLevelBudgetSummary[];
  overBudgetStops: string[];
  warnings: string[];
}

export class BudgetService {
  /**
   * Calculate full budget breakdown for a trip (PRD §6.1)
   */
  public static async calculateTripBudget(tripId: string, userId?: string): Promise<TripBudgetResponse> {
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        ...(userId ? { userId } : {}),
      },
      include: {
        stops: {
          orderBy: { order: 'asc' },
          include: {
            activities: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!trip) {
      throw new AppError('Trip not found or access denied', 404, 'TRIP_NOT_FOUND');
    }

    let totalBudget = 0;
    let totalEstimatedCost = 0;
    const warnings: string[] = [];
    const overBudgetStops: string[] = [];

    const categoryMap: Record<string, { amount: number; count: number }> = {};
    const costLevelMap: Record<string, { amount: number; count: number }> = {};

    const byStop: StopBudgetSummary[] = trip.stops.map((stop) => {
      const stopBudget = Number(stop.budget) || 0;
      totalBudget += stopBudget;

      let stopActualCost = 0;

      for (const act of stop.activities) {
        const cost = Number(act.cost) || 0;
        stopActualCost += cost;
        totalEstimatedCost += cost;

        const cat = act.category || 'OTHER';
        if (!categoryMap[cat]) categoryMap[cat] = { amount: 0, count: 0 };
        categoryMap[cat].amount += cost;
        categoryMap[cat].count += 1;

        const level = act.costLevel || 'MEDIUM';
        if (!costLevelMap[level]) costLevelMap[level] = { amount: 0, count: 0 };
        costLevelMap[level].amount += cost;
        costLevelMap[level].count += 1;
      }

      const isOver = stopBudget > 0 && stopActualCost > stopBudget;
      if (isOver) {
        overBudgetStops.push(stop.cityName);
        warnings.push(
          `Stop '${stop.cityName}' exceeded its budget of $${stopBudget.toFixed(2)} by $${(
            stopActualCost - stopBudget
          ).toFixed(2)}.`
        );
      }

      return {
        stopId: stop.id,
        cityName: stop.cityName,
        country: stop.country,
        order: stop.order,
        budget: Math.round(stopBudget * 100) / 100,
        actualCost: Math.round(stopActualCost * 100) / 100,
        remaining: Math.round((stopBudget - stopActualCost) * 100) / 100,
        isOverBudget: isOver,
        activityCount: stop.activities.length,
      };
    });

    const isTripOverBudget = totalBudget > 0 && totalEstimatedCost > totalBudget;
    if (isTripOverBudget) {
      warnings.unshift(
        `Trip '${trip.name}' is over total allocated budget by $${(
          totalEstimatedCost - totalBudget
        ).toFixed(2)}.`
      );
    }

    const byCategory: CategoryBudgetSummary[] = Object.entries(categoryMap).map(([category, val]) => ({
      category,
      amount: Math.round(val.amount * 100) / 100,
      percentage:
        totalEstimatedCost > 0 ? Math.round((val.amount / totalEstimatedCost) * 1000) / 10 : 0,
      activityCount: val.count,
    }));

    const byCostLevel: CostLevelBudgetSummary[] = Object.entries(costLevelMap).map(([level, val]) => ({
      costLevel: level,
      amount: Math.round(val.amount * 100) / 100,
      activityCount: val.count,
    }));

    return {
      tripId: trip.id,
      tripName: trip.name,
      totalBudget: Math.round(totalBudget * 100) / 100,
      totalEstimatedCost: Math.round(totalEstimatedCost * 100) / 100,
      balance: Math.round((totalBudget - totalEstimatedCost) * 100) / 100,
      isOverBudget: isTripOverBudget,
      byCategory,
      byStop,
      byCostLevel,
      overBudgetStops,
      warnings,
    };
  }
}
