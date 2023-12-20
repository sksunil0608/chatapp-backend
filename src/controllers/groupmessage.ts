import { Request, Response } from "express";
import { Socket } from 'socket.io';
import GroupMessage from "../models/groupmessage";
import User from "../models/user";
import sequelize from "../util/db";

function isInValidString(str: string) {
    return str === undefined || str.length === 0 ? true : false;
}

export const postCreateGroupMessage = async (req: Request, res: Response) => {
    try {
        const group_id = parseInt(req.params.groupId, 10);
        const {
            senderId: sender_id,
            message: message,
            message_type: message_type,
        } = req.body;

        if (
            isInValidString(sender_id) ||
            isInValidString(message) ||
            isInValidString(message_type)) {
            return res
                .status(204)
                .json({ err: "Message not sent" });
        }
        const response = await GroupMessage.create({
            sender_id: sender_id,
            group_id: group_id,
            message: message,
            message_type: message_type,
        });
        return res.status(201).json({ Success: "Message sent", message: response });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Backend API call
export const getGroupMessages = async (req: Request, res: Response) => {
    try {
        const groupId = req.params.groupId;
        const startIndex = parseInt(req.query.startIndex as string, 10) || 0; // Parse startIndex from query parameters
        const response = await GroupMessage.findAll({
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
                'message',
                'timestamp',
            ],
            order: [['timestamp', 'DESC']],
            raw: true,
            offset: startIndex,
            limit: 10
        });

        res.status(200).json({ messages: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const getMoreGroupMessagesSockets = async (socket: Socket, groupId: string, startIndex: number) => {
    try {
        const moreMessages = await GroupMessage.findAll({
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
    } catch (error) {
        console.error('Error fetching more messages:', error);
        socket.emit('error', "Internal Server Error");
    }
};
