import NutritionScore from '../controllers/nutritionScore.controller'; //redundant ?
import express from 'express';

const router = express.Router();

router.post('/', NutritionScore); 
export default router;