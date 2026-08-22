import type { Trip, BudgetBreakdown } from '../types';

export function calculateTripBudget(trip: Trip): BudgetBreakdown {
  const stops = trip.stops || [];
  
  const totalBudget = stops.reduce((sum, stop) => sum + (Number(stop.budget) || 0), 0);
  
  let totalEstimatedCost = 0;
  const categoryMap: Record<string, number> = {};
  const byStop: BudgetBreakdown['byStop'] = [];

  stops.forEach((stop) => {
    let stopCost = 0;
    const activities = stop.activities || [];
    
    activities.forEach((act) => {
      const cost = Number(act.cost) || 0;
      stopCost += cost;
      totalEstimatedCost += cost;
      
      const cat = (act.category || 'other').toLowerCase();
      categoryMap[cat] = (categoryMap[cat] || 0) + cost;
    });

    byStop.push({
      stopId: stop.id,
      cityName: stop.cityName,
      budget: Number(stop.budget) || 0,
      actualCost: stopCost,
    });
  });

  const byCategory: BudgetBreakdown['byCategory'] = Object.entries(categoryMap).map(([category, amount]) => {
    const percentage = totalEstimatedCost > 0 ? Math.round((amount / totalEstimatedCost) * 100) : 0;
    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      amount,
      percentage,
    };
  });

  byCategory.sort((a, b) => b.amount - a.amount);

  return {
    totalBudget: totalBudget || totalEstimatedCost,
    totalEstimatedCost,
    balance: (totalBudget || totalEstimatedCost) - totalEstimatedCost,
    byCategory,
    byStop,
  };
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
