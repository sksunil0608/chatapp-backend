"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRemoveMemberAdmin = exports.postMakeMemberAdmin = exports.postRemoveGroupMember = exports.postCreateGroupMember = exports.getUserGroups = exports.getGroupMembers = void 0;
const sequelize_1 = require("sequelize");
const groupmember_1 = __importDefault(require("../models/groupmember"));
const group_1 = __importDefault(require("../models/group"));
const user_1 = __importDefault(require("../models/user"));
function isInValidString(str) {
    return str === undefined || str.length === 0;
}
const getGroupMembers = async (req, res) => {
    try {
        const { groupId } = req.params;
        const groupMemberUserIds = await groupmember_1.default.findAll({
            where: { group_id: groupId },
            include: [
                {
                    model: user_1.default,
                    attributes: ['id', 'fname', 'lname', 'phone'],
                    as: "User"
                },
            ],
        });
        const users = groupMemberUserIds.map((groupMemberUserId) => {
            const user = groupMemberUserId.get('User');
            return {
                id: user.id,
                name: user.fname + ' ' + user.lname,
                phone: user.phone,
            };
        });
        const checkAdmin = await groupmember_1.default.findOne({
            where: {
                group_id: groupId,
                user_id: req.user?.id,
                is_admin: true
            }
        });
        const is_admin = checkAdmin ? true : false;
        res.status(200).json({ groupMembers: users, is_admin: is_admin });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getGroupMembers = getGroupMembers;
const getUserGroups = async (req, res) => {
    try {
        const userId = req.user?.id;
        const userGroups = await groupmember_1.default.findAll({ where: { user_id: userId } });
        res.status(200).json({ userGroups: userGroups });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getUserGroups = getUserGroups;
const postCreateGroupMember = async (req, res) => {
    try {
        const { user_id } = req.body;
        const group_id = parseInt(req.params.groupId, 10);
        // Check if the group member already exists
        const existingGroupMember = await groupmember_1.default.findOne({
            where: {
                [sequelize_1.Op.and]: [{ user_id: user_id }, { group_id: group_id }],
            },
        });
        if (!existingGroupMember) {
            // Find the group
            const group = await group_1.default.findByPk(group_id);
            if (!group) {
                return res.status(404).json({ error: 'Group not found.' });
            }
            // Create a new group member
            await groupmember_1.default.create({
                group_id,
                user_id,
                is_admin: false,
            });
            // Update the total_user count
            await group.increment('total_users');
            return res.status(201).json({ success: 'Group Member Created Successfully' });
        }
        else {
            return res.status(400).json({ error: 'User is already a member of this group.' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.postCreateGroupMember = postCreateGroupMember;
const postRemoveGroupMember = async (req, res) => {
    try {
        const { user_id } = req.body;
        const group_id = parseInt(req.params.groupId, 10);
        // Check if the group member exists
        const existingGroupMember = await groupmember_1.default.findOne({
            where: {
                [sequelize_1.Op.and]: [{ user_id: user_id }, { group_id: group_id }],
            },
        });
        if (existingGroupMember) {
            // Find the group
            const group = await group_1.default.findByPk(group_id);
            if (!group) {
                return res.status(404).json({ error: 'Group not found.' });
            }
            // Remove the specified group member
            await existingGroupMember.destroy();
            // Update the total_user count
            await group.decrement('total_users');
            return res.status(200).json({ success: 'Group Member Removed Successfully' });
        }
        else {
            return res.status(404).json({ error: 'Group member not found.' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.postRemoveGroupMember = postRemoveGroupMember;
const postMakeMemberAdmin = async (req, res) => {
    try {
        const { user_id } = req.body;
        const group_id = parseInt(req.params.groupId, 10);
        // Check if the group member exists
        const existingGroupMember = await groupmember_1.default.findOne({
            where: {
                [sequelize_1.Op.and]: [{ user_id: user_id }, { group_id: group_id }],
            },
        });
        if (existingGroupMember) {
            // Set is_admin to true
            existingGroupMember.is_admin = true;
            await existingGroupMember.save();
            return res.status(200).json({ success: 'User is now an admin of the group' });
        }
        else {
            return res.status(404).json({ error: 'Group member not found.' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.postMakeMemberAdmin = postMakeMemberAdmin;
const postRemoveMemberAdmin = async (req, res) => {
    try {
        const { user_id } = req.body;
        const group_id = parseInt(req.params.groupId, 10);
        // Check if the group member exists
        const existingGroupMember = await groupmember_1.default.findOne({
            where: {
                [sequelize_1.Op.and]: [{ user_id: user_id }, { group_id: group_id }],
            },
        });
        if (existingGroupMember) {
            // Set is_admin to false
            existingGroupMember.is_admin = false;
            await existingGroupMember.save();
            return res.status(200).json({ success: 'User is no longer an admin of the group' });
        }
        else {
            return res.status(404).json({ error: 'Group member not found.' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.postRemoveMemberAdmin = postRemoveMemberAdmin;
