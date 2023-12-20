import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../util/db';
import User from './user';
import Group from './group';
interface ArchiveGroupMessageAttributes {
    id: number;
    sender_id: number;
    group_id: number;
    message: string;
    message_type: string;
    timestamp: Date;
}

interface ArchiveGroupMessageCreationAttributes extends Optional<ArchiveGroupMessageAttributes, 'id' | 'timestamp'> { }

class ArchiveGroupMessage extends Model<ArchiveGroupMessageAttributes, ArchiveGroupMessageCreationAttributes> implements ArchiveGroupMessageAttributes {
    public id!: number;
    public sender_id!: number;
    public group_id!: number;
    public message!: string;
    public message_type!: string;
    public timestamp!: Date;
}

ArchiveGroupMessage.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Group,
                key: 'id',
            },
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'ArchiveGroupMessage',
    }
);

export default ArchiveGroupMessage;
