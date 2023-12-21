"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// contactlist.ts
const express_1 = require("express");
const contactlist_1 = require("../controllers/contactlist");
const authentication_1 = __importDefault(require("../middleware/authentication"));
const router = (0, express_1.Router)();
router.get("/contacts", authentication_1.default, contactlist_1.getContactList);
router.post("/contacts/add", authentication_1.default, contactlist_1.postAddContact);
router.post('/verify-vchat-user', authentication_1.default, contactlist_1.getVerifyVChatUser);
exports.default = router;
