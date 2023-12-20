import { Router } from "express";
import { getIndexView } from "../controllers/home";
import authenticate from "../middleware/authentication";
const router = Router();

router.get("/", authenticate, getIndexView);

export default router;
