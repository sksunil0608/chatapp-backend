import { Router } from "express";
import { getGroups, postCreateGroup } from "../controllers/group";
import authenticate from "../middleware/authentication";

const router = Router();

router.get("/groups", authenticate, getGroups);
router.post('/groups/create', authenticate, postCreateGroup);

export default router;
