"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCreateGroup = exports.getGroups = void 0;
const group_1 = __importDefault(require("../models/group"));
const groupmember_1 = __importDefault(require("../models/groupmember"));
const getGroups = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "User Unauthorized" });
        }
        const groups = await group_1.default.findAll({
            include: [{
                    model: groupmember_1.default,
                    where: { user_id: userId },
                    attributes: [],
                }],
        });
        res.status(200).json({ groups });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getGroups = getGroups;
const postCreateGroup = async (req, res) => {
    try {
        const { name: group_name, icon: group_icon, about: group_about } = req.body;
        if (!group_name || !group_icon) {
            return res.status(400).json({ error: "Bad Parameters, Please fill in details carefully" });
        }
        // Existing Group Validation
        const existingGroup = await group_1.default.findOne({ where: { name: group_name } });
        if (!existingGroup) {
            const createdGroup = await group_1.default.create({
                name: group_name,
                icon: group_icon,
                about: group_about,
                superadmin_user_id: req.user?.id,
                total_users: 1
            });
            // Make the creator an admin in the GroupMember table
            await groupmember_1.default.create({
                group_id: createdGroup.id,
                user_id: req.user?.id,
                is_admin: true,
            });
            return res.status(201).json({ success: "Group Created Successfully" });
        }
        else {
            return res.status(409).json({ error: "Sorry! This group name is not available" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.postCreateGroup = postCreateGroup;
