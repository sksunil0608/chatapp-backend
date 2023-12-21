"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoreGroupMessagesSockets = exports.getGroupMessages = exports.postCreateGroupMessage = void 0;
const groupmessage_1 = __importDefault(require("../models/groupmessage"));
const user_1 = __importDefault(require("../models/user"));
const db_1 = __importDefault(require("../util/db"));
function isInValidString(str) {
    return str === undefined || str.length === 0 ? true : false;
}
const postCreateGroupMessage = async (req, res) => {
    try {
        const group_id = parseInt(req.params.groupId, 10);
        const { senderId: sender_id, message: message, message_type: message_type, } = req.body;
        if (isInValidString(sender_id) ||
            isInValidString(message) ||
            isInValidString(message_type)) {
            return res
                .status(204)
                .json({ err: "Message not sent" });
        }
        const response = await groupmessage_1.default.create({
            sender_id: sender_id,
            group_id: group_id,
            message: message,
            message_type: message_type,
        });
        return res.status(201).json({ Success: "Message sent", message: response });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.postCreateGroupMessage = postCreateGroupMessage;
// Backend API call
const getGroupMessages = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const startIndex = parseInt(req.query.startIndex, 10) || 0; // Parse startIndex from query parameters
        const response = await groupmessage_1.default.findAll({
            where: { group_id: groupId },
            include: [{
                    model: user_1.default,
                    attributes: [
                        [db_1.default.fn('CONCAT', db_1.default.col('User.fname'), ' ', db_1.default.col('User.lname')), 'sender_name']
                    ],
                }],
            attributes: [
                'id',
                'sender_id',
                'message',
                'timestamp',
            ],
            order: [['timestamp', 'DESC']],
            raw: true,
            offset: startIndex,
            limit: 10
        });
        res.status(200).json({ messages: response });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getGroupMessages = getGroupMessages;
const getMoreGroupMessagesSockets = async (socket, groupId, startIndex) => {
    try {
        const moreMessages = await groupmessage_1.default.findAll({
            where: { group_id: groupId },
            include: [{
                    model: user_1.default,
                    attributes: [
                        [db_1.default.fn('CONCAT', db_1.default.col('User.fname'), ' ', db_1.default.col('User.lname')), 'sender_name']
                    ],
                }],
            attributes: [
                'id',
                'sender_id',
                'message',
                'timestamp',
            ],
            order: [['timestamp', 'DESC']],
            raw: true,
            offset: startIndex,
            limit: 10
        });
        // Emit the additional messages to the client
        socket.emit('more-messages', moreMessages);
    }
    catch (error) {
        console.error('Error fetching more messages:', error);
        socket.emit('error', "Internal Server Error");
    }
};
exports.getMoreGroupMessagesSockets = getMoreGroupMessagesSockets;
