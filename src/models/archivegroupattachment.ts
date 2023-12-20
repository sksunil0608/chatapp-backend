import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../util/db";
import Group from "./group";
import User from "./user";

interface ArchiveGroupAttachmentAttributes {
    id: number;
    sender_id: number;
    group_id: number;
    file_name: string;
    file_type: string;
    file_url: string;
    file_size: number;
    timestamp: Date;
}

interface ArchiveGroupAttachmentCreationAttributes extends Optional<ArchiveGroupAttachmentAttributes, 'id' | 'timestamp'> { }

class ArchiveGroupAttachment extends Model<ArchiveGroupAttachmentAttributes, ArchiveGroupAttachmentCreationAttributes> implements ArchiveGroupAttachmentAttributes {
    public id!: number;
    public sender_id!: number;
    public group_id!: number;
    public file_name!: string;
    public file_type!: string;
    public file_url!: string;
    public file_size!: number;
    public timestamp!: Date;
}

ArchiveGroupAttachment.init({
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
    file_name: {
        type: DataTypes.STRING,
    },
    file_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    file_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    file_size: {
        type: DataTypes.INTEGER,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'ArchiveGroupAttachment',
    hooks: {
        beforeCreate: (attachment, options) => {
            // If file_name is not provided, generate a default one
            if (!attachment.file_name) {
                attachment.file_name = `attachment_${Date.now()}`;
            }
        },
    },
});

export default ArchiveGroupAttachment