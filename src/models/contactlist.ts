import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../util/db';
import User from './user';

interface ContactListAttributes {
    id: number;
    user_id: number;
    name: string;
    email: string;
    phone: string;
}

interface ContactListCreationAttributes extends Optional<ContactListAttributes, 'id'> { }

class ContactList extends Model<ContactListAttributes, ContactListCreationAttributes> implements ContactListAttributes {
    public id!: number;
    public user_id!: number;
    public name!: string;
    public email!: string;
    public phone!: string;
}

ContactList.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'ContactList',
    }
);

export default ContactList;
