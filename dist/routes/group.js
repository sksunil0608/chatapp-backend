"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const group_1 = require("../controllers/group");
const authentication_1 = __importDefault(require("../middleware/authentication"));
const router = (0, express_1.Router)();
router.get("/groups", authentication_1.default, group_1.getGroups);
router.post('/groups/create', authentication_1.default, group_1.postCreateGroup);
exports.default = router;
