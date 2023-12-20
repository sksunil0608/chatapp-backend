// contactlist.ts
import { Request, Response } from "express";
import ContactList from "../models/contactlist";
import User from "../models/user";
import { Op } from "sequelize";
import GroupMember from "../models/groupmember";


function isInValidString(str: string) {
    return str === undefined || str.length === 0 ? true : false;
}

export const getVerifyVChatUser = async (req: Request, res: Response) => {
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

        const userExist = await User.findAll({
            where: {
                [Op.or]: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });

        if (userExist.length !== 0) {

            const alreadyGroupMember = await GroupMember.findAll({
                where: {
                    [Op.and]: [
                        { group_id: groupId },
                        { user_id: userExist[0].id }
                    ]
                }
            })
            if (alreadyGroupMember.length !== 0) {
                return res.status(200).json({ isVChatUser: true, isalreadyGroupMember: true });
            }

            res.status(200).json({ isVChatUser: true, isalreadyGroupMember: false, userId: userExist[0].id });
        } else {
            res.status(200).json({ isVChatUser: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getContactList = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const contacts = await ContactList.findAll({ where: { user_id: userId } });
        res.status(200).json({ contacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const postAddContact = async (req: Request, res: Response) => {
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

        await ContactList.create({
            user_id: userId,
            name: name,
            email: email,
            phone: phone
        });

        res.status(201).json({ success: "Contact added successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
