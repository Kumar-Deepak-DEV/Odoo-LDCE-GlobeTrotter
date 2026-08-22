import { Request, Response, NextFunction } from 'express';
import { BudgetService } from './budget.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/appError';

export class BudgetController {
  /**
   * Get detailed budget breakdown for a trip (PRD §8: GET /api/trips/:id/budget)
   */
  public static async getTripBudget(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const { id } = req.params;
      const budgetAnalysis = await BudgetService.calculateTripBudget(id, req.user.id);

      sendSuccess(res, { budget: budgetAnalysis });
    } catch (error) {
      next(error);
    }
  }
}
