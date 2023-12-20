import { Request, Response } from "express";
import sequelize from "../util/db";
import GroupFileAttachment from "../models/groupfileattachment";
import uploadtoS3 from "../services/S3Service";
import User from "../models/user";
import { Socket } from 'socket.io';
export const uploadGroupAttachment = async (req: Request, res: Response) => {
    try {
        const group_id = parseInt(req.params.groupId, 10);
        const { senderId } = req.body;
        const sender_id = parseInt(senderId, 10);
        const attachments: Express.Multer.File[] = req.files as Express.Multer.File[];

        const promises = attachments.map(async (attachment) => {
            const file_name = attachment.originalname;
            const file_type = attachment.mimetype;
            const file_size = attachment.size;

            // Example: Upload to S3
            const file_path = `group${group_id}/${file_name}`;
            const file_url = await uploadtoS3(attachment.buffer, file_path, file_type);

            const createdAttachment = await GroupFileAttachment.create({
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

    } catch (error) {
        console.error("Error processing attachments:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};







export const getGroupAttachments = async (req: Request, res: Response) => {
    try {
        const groupId = req.params.groupId;
        const startIndex = parseInt(req.query.startIndex as string, 10) || 0; // Parse startIndex from query parameters

        const response = await GroupFileAttachment.findAll({
            where: { group_id: groupId },
            include: [{
                model: User,
                attributes: [
                    [sequelize.fn('CONCAT', sequelize.col('User.fname'), ' ', sequelize.col('User.lname')), 'sender_name']
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
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// In your groupfileattachment.js controller
export const getMoreGroupAttachmentsSockets = async (socket: Socket, groupId: string, startIndex: number) => {
    try {
        const moreAttachments = await GroupFileAttachment.findAll({
            where: { group_id: groupId },
            include: [{
                model: User,
                attributes: [
                    [sequelize.fn('CONCAT', sequelize.col('User.fname'), ' ', sequelize.col('User.lname')), 'sender_name']
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
    } catch (error) {
        console.error('Error fetching more attachments:', error);
        socket.emit('error', "Internal Server Error");
    }
};
