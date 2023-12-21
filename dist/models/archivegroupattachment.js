"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../util/db"));
const group_1 = __importDefault(require("./group"));
const user_1 = __importDefault(require("./user"));
class ArchiveGroupAttachment extends sequelize_1.Model {
}
ArchiveGroupAttachment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    sender_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user_1.default,
            key: 'id',
        },
    },
    group_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: group_1.default,
            key: 'id',
        },
    },
    file_name: {
        type: sequelize_1.DataTypes.STRING,
    },
    file_type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    file_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    file_size: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    timestamp: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.default,
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
exports.default = ArchiveGroupAttachment;
