import PostController from "../controllers/post.controller";
const router = express.Router();
router.post("/", PostController.createBlogPost);
export default router;