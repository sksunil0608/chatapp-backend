"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoreGroupAttachmentsSockets = exports.getGroupAttachments = exports.uploadGroupAttachment = void 0;
const db_1 = __importDefault(require("../util/db"));
const groupfileattachment_1 = __importDefault(require("../models/groupfileattachment"));
const S3Service_1 = __importDefault(require("../services/S3Service"));
const user_1 = __importDefault(require("../models/user"));
const uploadGroupAttachment = async (req, res) => {
    try {
        const group_id = parseInt(req.params.groupId, 10);
        const { senderId } = req.body;
        const sender_id = parseInt(senderId, 10);
        const attachments = req.files;
        const promises = attachments.map(async (attachment) => {
            const file_name = attachment.originalname;
            const file_type = attachment.mimetype;
            const file_size = attachment.size;
            // Example: Upload to S3
            const file_path = `group${group_id}/${file_name}`;
            const file_url = await (0, S3Service_1.default)(attachment.buffer, file_path, file_type);
            const createdAttachment = await groupfileattachment_1.default.create({
                sender_id: sender_id,
                group_id: group_id,
                file_name: file_name,
                file_type: file_type,
                file_url: file_url,
                file_size: file_size
            });
            return {
                id: createdAttachment.id,
                sender_id: createdAttachment.sender_id,
                file_url: createdAttachment.file_url,
                file_name: createdAttachment.file_name,
                timestamp: createdAttachment.timestamp,
                file_type: createdAttachment.file_type,
                file_size: createdAttachment.file_size,
            };
        });
        const uploadedAttachments = await Promise.all(promises);
        res.json({ attachments: uploadedAttachments });
    }
    catch (error) {
        console.error("Error processing attachments:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.uploadGroupAttachment = uploadGroupAttachment;
const getGroupAttachments = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const startIndex = parseInt(req.query.startIndex, 10) || 0; // Parse startIndex from query parameters
        const response = await groupfileattachment_1.default.findAll({
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
                'file_name',
                'file_url',
                'file_type',
                'timestamp',
            ],
            order: [['timestamp', 'DESC']],
            raw: true,
            offset: startIndex,
            limit: 5
        });
        res.status(200).json({ attachments: response });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getGroupAttachments = getGroupAttachments;
// In your groupfileattachment.js controller
const getMoreGroupAttachmentsSockets = async (socket, groupId, startIndex) => {
    try {
        const moreAttachments = await groupfileattachment_1.default.findAll({
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
                'file_name',
                'file_type',
                'file_url',
                'timestamp',
            ],
            order: [['timestamp', 'DESC']],
            raw: true,
            offset: startIndex,
            limit: 5
        });
        // Emit the additional attachments to the client
        socket.emit('more-attachments', moreAttachments);
    }
    catch (error) {
        console.error('Error fetching more attachments:', error);
        socket.emit('error', "Internal Server Error");
    }
};
exports.getMoreGroupAttachmentsSockets = getMoreGroupAttachmentsSockets;
