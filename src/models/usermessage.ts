// UserMessage model
import sequelize from "../util/db";
import { Model, DataTypes } from "sequelize";

class UserMessage extends Model {
    public id!: number;
    public sender_id!: number;
    public receiver_id!: number;
    public message!: string;
    public message_type!: string;
    public timestamp!: Date;
}

UserMessage.init(
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
                model: "Users",
                key: "id",
            },
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
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
        modelName: "UserMessage",
    }
);

export default UserMessage;
