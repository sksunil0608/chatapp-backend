import { Router } from "express";
import { getLoginView, postLogin, postSignup } from "../controllers/user";
const router = Router();

router.get("/login", getLoginView);

router.post("/signup", postSignup);

router.post("/login", postLogin);

export default router;
