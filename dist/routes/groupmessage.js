"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groupmessage_1 = require("../controllers/groupmessage");
const authentication_1 = __importDefault(require("../middleware/authentication"));
const groupfileattachment_1 = require("../controllers/groupfileattachment");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.get('/groups/:groupId/messages', authentication_1.default, groupmessage_1.getGroupMessages);
router.post('/groups/:groupId/messages', authentication_1.default, groupmessage_1.postCreateGroupMessage);
router.post('/groups/:groupId/attachments', authentication_1.default, upload.array('attachments[]'), groupfileattachment_1.uploadGroupAttachment);
router.get('/groups/:groupId/attachments', authentication_1.default, groupfileattachment_1.getGroupAttachments);
exports.default = router;
