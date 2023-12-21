"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAddContact = exports.getContactList = exports.getVerifyVChatUser = void 0;
const contactlist_1 = __importDefault(require("../models/contactlist"));
const user_1 = __importDefault(require("../models/user"));
const sequelize_1 = require("sequelize");
const groupmember_1 = __importDefault(require("../models/groupmember"));
function isInValidString(str) {
    return str === undefined || str.length === 0 ? true : false;
}
const getVerifyVChatUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { email, phone, groupId } = req.body;
        // Check if both email and phone are provided
        if (!email && !phone) {
            return res.status(400).json({ error: 'Email or phone must be provided' });
        }
        const userExist = await user_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });
        if (userExist.length !== 0) {
            const alreadyGroupMember = await groupmember_1.default.findAll({
                where: {
                    [sequelize_1.Op.and]: [
                        { group_id: groupId },
                        { user_id: userExist[0].id }
                    ]
                }
            });
            if (alreadyGroupMember.length !== 0) {
                return res.status(200).json({ isVChatUser: true, isalreadyGroupMember: true });
            }
            res.status(200).json({ isVChatUser: true, isalreadyGroupMember: false, userId: userExist[0].id });
        }
        else {
            res.status(200).json({ isVChatUser: false });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getVerifyVChatUser = getVerifyVChatUser;
const getContactList = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const contacts = await contactlist_1.default.findAll({ where: { user_id: userId } });
        res.status(200).json({ contacts });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getContactList = getContactList;
const postAddContact = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { name, email, phone } = req.body;
        if (isInValidString(name) || isInValidString(email) || isInValidString(phone)) {
            return res
                .status(204)
                .json({ err: "Bad Parameters, Please fill details carefully" });
        }
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        await contactlist_1.default.create({
            user_id: userId,
            name: name,
            email: email,
            phone: phone
        });
        res.status(201).json({ success: "Contact added successfully." });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.postAddContact = postAddContact;
