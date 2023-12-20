import express from "express";
import bodyParser from "body-parser";
import sequelize from "./util/db";
import cors from "cors";
// Models Import
import User from "./models/user";
import UserMessage from "./models/usermessage";
import Group from "./models/group";
import GroupMember from "./models/groupmember";
import GroupMessage from "./models/groupmessage";
import ContactList from "./models/contactlist";
import GroupFileAttachment from "./models/groupfileattachment";
import ArchiveGroupMessage from "./models/archivegroupmessage";
//Routes Import
import userRoutes from "./routes/user";
import groupRoutes from "./routes/group"
import groupmessageRoutes from "./routes/groupmessage"
import contactlistRoutes from "./routes/contactlist"
import groupmemberRoutes from "./routes/groupmember"
//Socket .io
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { setupGroupChatSocket } from './sockets/groupchat_socket';
import './cronJobs/archiveGroupMessage'
import './cronJobs/archiveGroupAttachment'

const app = express()
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    // credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Socket.io
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
});
setupGroupChatSocket(io);
//socket.io end

app.use(userRoutes);
app.use(groupRoutes)
app.use(groupmessageRoutes)
app.use(contactlistRoutes)
app.use(groupmemberRoutes)
// User associations
User.hasMany(UserMessage, { foreignKey: 'sender_id', as: 'sentMessages' });
User.hasMany(UserMessage, { foreignKey: 'receiver_id', as: 'receivedMessages' });
User.hasMany(ContactList, { foreignKey: 'user_id', constraints: false });

// Group associations
User.belongsToMany(Group, { through: GroupMember, foreignKey: 'user_id' });
Group.belongsToMany(User, { through: GroupMember, foreignKey: 'group_id' });
Group.hasMany(GroupMember, { foreignKey: 'group_id' });
Group.hasMany(GroupMessage, { foreignKey: 'group_id' });

// GroupMember associations
GroupMember.belongsTo(Group, { foreignKey: 'group_id' });
GroupMember.belongsTo(User, { foreignKey: 'user_id', as: 'User' });


// GroupMessage associations
GroupMessage.belongsTo(Group, { foreignKey: 'group_id' });
GroupMessage.belongsTo(User, { foreignKey: 'sender_id' });

// ArchiveGroupMessage associations
ArchiveGroupMessage.belongsTo(Group, { foreignKey: 'group_id' });
ArchiveGroupMessage.belongsTo(User, { foreignKey: 'sender_id' });

// UserMessage associations
UserMessage.belongsTo(User, { foreignKey: 'sender_id' });
UserMessage.belongsTo(Group, { foreignKey: 'group_id' });

//Group File Attachments Associations
GroupFileAttachment.belongsTo(User, { foreignKey: 'sender_id' })
GroupFileAttachment.belongsTo(Group, { foreignKey: 'group_id' })

async function startServer() {
  try {
    // Sync Database
    await sequelize.sync();

    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}
startServer();