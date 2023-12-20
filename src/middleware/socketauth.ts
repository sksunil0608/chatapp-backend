import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/user'

export const socketAuthMiddleware = async (socket: Socket, next: Function) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication failed: Token is missing'));
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string };
        const userId = decodedToken.userId;
        const user = await User.findByPk(userId);

        if (!user) {
            return next(new Error('Authentication failed: User not found'));
        }
        (socket as any).user = user;

        next();
    } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication failed'));
    }
};
