import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

interface NutritionScoreCategory {
  category: string;
  count: number;
}

interface AggregatedNutritionData {
  success: boolean;
  data?: NutritionScoreCategory[];
  error?: string;
}

/**
 * Get Average Nutrition Score
 * Aggregates nutrition scores and groups them by category (A, B, C, D, E)
 * @param req - Express request object
 * @param res - Express response object
 */
const getAverageNutritionScore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Abrufen aller ScanItems aus der Datenbank
    const scanItems = await prisma.scanItem.findMany({
      select: {
        nutriScoreCategory: true,
      },
    });

    if (!scanItems || scanItems.length === 0) {
      res.status(404).json({
        success: false,
        error: 'No nutrition score data found',
      });
      return;
    }

    // Aggregation nach Nutrition Score Kategorie
    const aggregatedData = aggregateNutritionScores(scanItems);

    res.status(200).json({
      success: true,
      data: aggregatedData,
    });
  } catch (error) {
    console.error('Error retrieving nutrition scores:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve nutrition score data. Please try again later.',
    });
  }
};

/**
 * Aggregiert ScanItems nach Nutrition Score Kategorien
 * @param scanItems - Array von ScanItems mit nutriScoreCategory-Feld
 * @returns Array von Kategorien mit Counts
 */
const aggregateNutritionScores = (
  scanItems: Array<{ nutriScoreCategory: string }>
): NutritionScoreCategory[] => {
  const scoreMap = new Map<string, number>();
  const validCategories = ['A', 'B', 'C', 'D', 'E'];

  // Initialisiere alle Kategorien mit 0
  validCategories.forEach((cat) => scoreMap.set(cat, 0));

  // Zähle die ScanItems pro Kategorie
  scanItems.forEach((item) => {
    const score = (item.nutriScoreCategory || 'UNKNOWN').toUpperCase();
    if (scoreMap.has(score)) {
      scoreMap.set(score, (scoreMap.get(score) || 0) + 1);
    } else if (score !== 'UNKNOWN') {
      // Falls eine andere Kategorie existiert
      scoreMap.set(score, 1);
    }
  });

  // Konvertiere Map zu Array und sortiere nach Kategorie
  return Array.from(scoreMap, ([category, count]) => ({
    category,
    count,
  })).sort((a, b) => a.category.localeCompare(b.category));
};

// Default Export
export default {
  getAverageNutritionScore,
  aggregateNutritionScores,
};