import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../util/db';
import User from './user';

interface GroupAttributes {
    id: number;
    name: string;
    about: string | null;
    icon: string | null;
    superadmin_user_id: number;
    total_users: number;
}

interface GroupCreationAttributes extends Optional<GroupAttributes, 'id' | 'about' | 'icon'> { }

class Group extends Model<GroupAttributes, GroupCreationAttributes> implements GroupAttributes {
    public id!: number;
    public name!: string;
    public about!: string | null;
    public icon!: string | null;
    public superadmin_user_id!: number;
    public total_users!: number;
}

Group.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        about: {
            type: DataTypes.STRING,
        },
        icon: {
            type: DataTypes.STRING,
        },
        superadmin_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User, // Assuming your User model is imported
                key: 'id',
            },
        },
        total_users: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'Group',
    }
);

export default Group;
