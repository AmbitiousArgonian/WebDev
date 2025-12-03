import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const controller = express.Router();
const prisma = new PrismaClient();

// POST /api/scanItem
controller.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name = 'UNKNOWN',
      ean = 'UNKNOWN',
      ecoScore = -1,
      ecoScoreCategory = 'UNKNOWN',
      nutriScore = -1,
      nutriScoreCategory = 'UNKNOWN',
      content = 'UNKNOWN',
      nutrition = {},
      userId = 1 // Placeholder — später aus Session holen
    } = req.body;

    // ScanItem mit Nutrition erstellen
    const scanItem = await prisma.scanItem.create({
      data: {
        name,
        ean,
        ecoScore,
        ecoScoreCategory,
        nutriScore,
        nutriScoreCategory,
        content,
        userId,
        nutrition: {
          create: Object.entries(nutrition).map(([nutrientName, value]) => ({
            name: nutrientName,
            value: Number(value) || -1
          }))
        }
      },
      include: {
        nutrition: true
      }
    });

    res.status(200).json(scanItem);
  } catch (error) {
    console.error('Error creating scan item:', error);
    res.status(500).json({ error: 'Error creating item' });
  }
});

export default controller;