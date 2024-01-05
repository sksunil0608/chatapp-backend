"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = __importDefault(require("./util/db"));
const cors_1 = __importDefault(require("cors"));
// Models Import
const user_1 = __importDefault(require("./models/user"));
const usermessage_1 = __importDefault(require("./models/usermessage"));
const group_1 = __importDefault(require("./models/group"));
const groupmember_1 = __importDefault(require("./models/groupmember"));
const groupmessage_1 = __importDefault(require("./models/groupmessage"));
const contactlist_1 = __importDefault(require("./models/contactlist"));
const groupfileattachment_1 = __importDefault(require("./models/groupfileattachment"));
const archivegroupmessage_1 = __importDefault(require("./models/archivegroupmessage"));
//Routes Import
const user_2 = __importDefault(require("./routes/user"));
const group_2 = __importDefault(require("./routes/group"));
const groupmessage_2 = __importDefault(require("./routes/groupmessage"));
const contactlist_2 = __importDefault(require("./routes/contactlist"));
const groupmember_2 = __importDefault(require("./routes/groupmember"));
//Socket .io
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const groupchat_socket_1 = require("./sockets/groupchat_socket");
require("./cronJobs/archiveGroupMessage");
require("./cronJobs/archiveGroupAttachment");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    // credentials: true,
}));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
//Socket.io
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: ['https://vchat.vismrit.com'],
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
});
(0, groupchat_socket_1.setupGroupChatSocket)(io);
//socket.io end
app.use(user_2.default);
app.use(group_2.default);
app.use(groupmessage_2.default);
app.use(contactlist_2.default);
app.use(groupmember_2.default);
// User associations
user_1.default.hasMany(usermessage_1.default, { foreignKey: 'sender_id', as: 'sentMessages', onDelete: 'CASCADE' });
user_1.default.hasMany(usermessage_1.default, { foreignKey: 'receiver_id', as: 'receivedMessages', onDelete: 'CASCADE' });
user_1.default.hasMany(contactlist_1.default, { foreignKey: 'user_id', constraints: false });
// Group associations
user_1.default.belongsToMany(group_1.default, { through: groupmember_1.default, foreignKey: 'user_id' });
group_1.default.belongsToMany(user_1.default, { through: groupmember_1.default, foreignKey: 'group_id' });
group_1.default.hasMany(groupmember_1.default, { foreignKey: 'group_id', onDelete: 'CASCADE' });
group_1.default.hasMany(groupmessage_1.default, { foreignKey: 'group_id', onDelete: 'CASCADE' });
// GroupMember associations
groupmember_1.default.belongsTo(group_1.default, { foreignKey: 'group_id', onDelete: 'CASCADE' });
groupmember_1.default.belongsTo(user_1.default, { foreignKey: 'user_id', as: 'User', onDelete: 'CASCADE' });
// GroupMessage associations
groupmessage_1.default.belongsTo(group_1.default, { foreignKey: 'group_id', onDelete: 'CASCADE' });
groupmessage_1.default.belongsTo(user_1.default, { foreignKey: 'sender_id', onDelete: 'CASCADE' });
// ArchiveGroupMessage associations
archivegroupmessage_1.default.belongsTo(group_1.default, { foreignKey: 'group_id', onDelete: 'CASCADE' });
archivegroupmessage_1.default.belongsTo(user_1.default, { foreignKey: 'sender_id', onDelete: 'CASCADE' });
// UserMessage associations
usermessage_1.default.belongsTo(user_1.default, { foreignKey: 'sender_id', onDelete: 'CASCADE' });
usermessage_1.default.belongsTo(group_1.default, { foreignKey: 'group_id', onDelete: 'CASCADE' });
// Group File Attachments Associations
groupfileattachment_1.default.belongsTo(user_1.default, { foreignKey: 'sender_id', onDelete: 'CASCADE' });
groupfileattachment_1.default.belongsTo(group_1.default, { foreignKey: 'group_id', onDelete: 'CASCADE' });
async function startServer() {
    try {
        // Sync Database
        await db_1.default.sync();
        const PORT = process.env.PORT || 4000;
        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error(err);
    }
}
startServer();
