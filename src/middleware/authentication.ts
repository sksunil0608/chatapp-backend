import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string };
        const userId = decodedToken.userId;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = user
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default authenticate;
