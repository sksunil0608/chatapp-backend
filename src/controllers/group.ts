import { Request, Response } from "express";
import Group from "../models/group";
import GroupMember from "../models/groupmember";


export const getGroups = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "User Unauthorized" });
        }
        const groups = await Group.findAll({
            include: [{
                model: GroupMember,
                where: { user_id: userId },
                attributes: [],
            }],
        });

        res.status(200).json({ groups });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const postCreateGroup = async (req: Request, res: Response) => {
    try {
        const { name: group_name, icon: group_icon, about: group_about } = req.body;

        if (!group_name || !group_icon) {
            return res.status(400).json({ error: "Bad Parameters, Please fill in details carefully" });
        }

        // Existing Group Validation
        const existingGroup = await Group.findOne({ where: { name: group_name } });

        if (!existingGroup) {
            const createdGroup = await Group.create({
                name: group_name,
                icon: group_icon,
                about: group_about,
                superadmin_user_id: req.user?.id!,
                total_users: 1
            });

            // Make the creator an admin in the GroupMember table
            await GroupMember.create({
                group_id: createdGroup.id,
                user_id: req.user?.id!,
                is_admin: true,
            });

            return res.status(201).json({ success: "Group Created Successfully" });
        } else {
            return res.status(409).json({ error: "Sorry! This group name is not available" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
