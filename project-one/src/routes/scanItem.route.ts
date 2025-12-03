import ScanItem from '../controllers/scanItem.controller';

const router = express.Router();

router.post('/', ScanItem); 
export default router;