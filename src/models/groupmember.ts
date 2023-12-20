import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../util/db';
import Group from './group';
import User from './user';

interface GroupMemberAttributes {
    group_id: number;
    user_id: number;
    is_admin: boolean;
}

interface GroupMemberCreationAttributes extends Optional<GroupMemberAttributes, 'is_admin'> { }

class GroupMember extends Model<GroupMemberAttributes, GroupMemberCreationAttributes> implements GroupMemberAttributes {
    public group_id!: number;
    public user_id!: number;
    public is_admin!: boolean;
}

GroupMember.init(
    {
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: Group,
                key: 'id',
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: User,
                key: 'id',
            },
        },
        is_admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: 'GroupMember',
    }
);

export default GroupMember;
