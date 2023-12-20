import { Request, Response } from 'express';
import { Op } from 'sequelize';
import GroupMember from '../models/groupmember';
import Group from '../models/group';
import User from '../models/user';

function isInValidString(str: string | undefined) {
    return str === undefined || str.length === 0;
}

interface UserInstance {
    id: number;
    fname: string;
    lname: string;
    phone: string;
}


export const getGroupMembers = async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;
        const groupMemberUserIds = await GroupMember.findAll({
            where: { group_id: groupId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'fname', 'lname', 'phone'],
                    as: "User"
                },
            ],
        });
        const users = groupMemberUserIds.map((groupMemberUserId) => {
            const user = groupMemberUserId.get('User') as UserInstance;
            return {
                id: user.id,
                name: user.fname + ' ' + user.lname,
                phone: user.phone,
            };
        });

        const checkAdmin = await GroupMember.findOne({
            where: {
                group_id: groupId,
                user_id: req.user?.id,
                is_admin: true
            }
        });

        const is_admin = checkAdmin ? true : false;

        res.status(200).json({ groupMembers: users, is_admin: is_admin });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getUserGroups = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const userGroups = await GroupMember.findAll({ where: { user_id: userId } });
        res.status(200).json({ userGroups: userGroups });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const postCreateGroupMember = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body;
        const group_id = parseInt(req.params.groupId, 10)

        // Check if the group member already exists
        const existingGroupMember = await GroupMember.findOne({
            where: {
                [Op.and]: [{ user_id: user_id }, { group_id: group_id }],
            },
        });

        if (!existingGroupMember) {
            // Find the group
            const group = await Group.findByPk(group_id);

            if (!group) {
                return res.status(404).json({ error: 'Group not found.' });
            }

            // Create a new group member
            await GroupMember.create({
                group_id,
                user_id,
                is_admin: false,
            });

            // Update the total_user count
            await group.increment('total_users');

            return res.status(201).json({ success: 'Group Member Created Successfully' });
        } else {
            return res.status(400).json({ error: 'User is already a member of this group.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const postRemoveGroupMember = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body;
        const group_id = parseInt(req.params.groupId, 10)

        // Check if the group member exists
        const existingGroupMember = await GroupMember.findOne({
            where: {
                [Op.and]: [{ user_id: user_id }, { group_id: group_id }],
            },
        });

        if (existingGroupMember) {
            // Find the group
            const group = await Group.findByPk(group_id);

            if (!group) {
                return res.status(404).json({ error: 'Group not found.' });
            }

            // Remove the specified group member
            await existingGroupMember.destroy();

            // Update the total_user count
            await group.decrement('total_users');

            return res.status(200).json({ success: 'Group Member Removed Successfully' });
        } else {
            return res.status(404).json({ error: 'Group member not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const postMakeMemberAdmin = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body;
        const group_id = parseInt(req.params.groupId, 10);

        // Check if the group member exists
        const existingGroupMember = await GroupMember.findOne({
            where: {
                [Op.and]: [{ user_id: user_id }, { group_id: group_id }],
            },
        });

        if (existingGroupMember) {
            // Set is_admin to true
            existingGroupMember.is_admin = true;
            await existingGroupMember.save();

            return res.status(200).json({ success: 'User is now an admin of the group' });
        } else {
            return res.status(404).json({ error: 'Group member not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const postRemoveMemberAdmin = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body;
        const group_id = parseInt(req.params.groupId, 10);

        // Check if the group member exists
        const existingGroupMember = await GroupMember.findOne({
            where: {
                [Op.and]: [{ user_id: user_id }, { group_id: group_id }],
            },
        });

        if (existingGroupMember) {
            // Set is_admin to false
            existingGroupMember.is_admin = false;
            await existingGroupMember.save();

            return res.status(200).json({ success: 'User is no longer an admin of the group' });
        } else {
            return res.status(404).json({ error: 'Group member not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};