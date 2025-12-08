import NutritionScore from '../controllers/nutritionScore.controller';
import express from 'express';

const router = express.Router();

router.post('/', NutritionScore); 
export default router;