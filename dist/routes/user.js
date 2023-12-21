"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const router = (0, express_1.Router)();
router.get("/login", user_1.getLoginView);
router.post("/signup", user_1.postSignup);
router.post("/login", user_1.postLogin);
exports.default = router;
