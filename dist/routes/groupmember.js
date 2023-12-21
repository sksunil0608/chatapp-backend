"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groupmember_1 = require("../controllers/groupmember");
const authentication_1 = __importDefault(require("../middleware/authentication"));
const router = (0, express_1.Router)();
router.get("/groups/:groupId/members", authentication_1.default, groupmember_1.getGroupMembers);
router.post('/groups/:groupId/members', authentication_1.default, groupmember_1.postCreateGroupMember);
router.post('/groups/:groupId/members/remove', authentication_1.default, groupmember_1.postRemoveGroupMember);
router.put('/groups/:groupId/members/make-admin', authentication_1.default, groupmember_1.postMakeMemberAdmin);
router.put('/groups/:groupId/members/remove-admin');
router.get('/user/groups', authentication_1.default, groupmember_1.getUserGroups);
exports.default = router;
