"use strict";
// groupChatSocket.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGroupChatSocket = void 0;
const socketauth_1 = require("../middleware/socketauth");
const groupmessage_1 = require("../controllers/groupmessage");
const groupfileattachment_1 = require("../controllers/groupfileattachment");
const setupGroupChatSocket = (io) => {
    const groupChatNamespace = io.of('/group-chat');
    // Use the socketAuthMiddleware
    groupChatNamespace.use(socketauth_1.socketAuthMiddleware);
    groupChatNamespace.on('connection', (socket) => {
        socket.on('send-message', async (message, groupId, senderName) => {
            // Broadcast the message to all connected clients in the group
            try {
                groupChatNamespace.emit('new-message', message, senderName);
                socket.to(groupId).emit('send-message', message, senderName);
            }
            catch (error) {
                console.log(error);
            }
        });
        socket.on('send-attachments', async (attachments, groupId, senderName) => {
            try {
                groupChatNamespace.emit('new-attachments', attachments, senderName);
                socket.to(groupId).emit('send-attachments', attachments, senderName);
            }
            catch (error) {
                console.log(error);
            }
        });
        socket.on('load-more-messages', async () => {
            socket.on('load-more-messages', async (groupId, startIndex) => {
                try {
                    // Call the new function to handle socket events
                    await (0, groupmessage_1.getMoreGroupMessagesSockets)(socket, groupId, startIndex);
                }
                catch (error) {
                    console.log(error);
                }
            });
        });
        socket.on('load-more-attachments', async () => {
            socket.on('load-more-attachments', async (groupId, startIndex) => {
                try {
                    // Call the function to handle socket events for loading more attachments
                    const hh = await (0, groupfileattachment_1.getMoreGroupAttachmentsSockets)(socket, groupId, startIndex);
                }
                catch (error) {
                    console.log(error);
                }
            });
        });
    });
};
exports.setupGroupChatSocket = setupGroupChatSocket;
