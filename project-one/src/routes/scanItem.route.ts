import ScanItem from '../controllers/scanItem.controller'; //redundant ?
import express from 'express';

const router = express.Router();

router.post('/', ScanItem); 
export default router;