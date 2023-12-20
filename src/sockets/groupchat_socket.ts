// groupChatSocket.ts

import { Server as SocketIOServer, Namespace } from 'socket.io';
import { socketAuthMiddleware } from '../middleware/socketauth';
import { getMoreGroupMessagesSockets } from '../controllers/groupmessage';
import { getMoreGroupAttachmentsSockets } from '../controllers/groupfileattachment';

export const setupGroupChatSocket = (io: SocketIOServer) => {
    const groupChatNamespace: Namespace = io.of('/group-chat');

    // Use the socketAuthMiddleware
    groupChatNamespace.use(socketAuthMiddleware);

    groupChatNamespace.on('connection', (socket) => {
        socket.on('send-message', async (message, groupId, senderName) => {
            // Broadcast the message to all connected clients in the group
            try {
                groupChatNamespace.emit('new-message', message, senderName);
                socket.to(groupId).emit('send-message', message, senderName);

            } catch (error) {
                console.log(error);
            }
        });




        socket.on('send-attachments', async (attachments, groupId, senderName) => {
            try {
                groupChatNamespace.emit('new-attachments', attachments, senderName);
                socket.to(groupId).emit('send-attachments', attachments, senderName);
            } catch (error) {
                console.log(error);
            }
        });

        socket.on('load-more-messages', async () => {
            socket.on('load-more-messages', async (groupId, startIndex) => {
                try {
                    // Call the new function to handle socket events
                    await getMoreGroupMessagesSockets(socket, groupId, startIndex);
                } catch (error) {
                    console.log(error);
                }
            });
        });
        socket.on('load-more-attachments', async () => {
            socket.on('load-more-attachments', async (groupId, startIndex) => {
                try {
                    // Call the function to handle socket events for loading more attachments
                    const hh = await getMoreGroupAttachmentsSockets(socket, groupId, startIndex);
                } catch (error) {
                    console.log(error);
                }
            });
        })

    });
};
