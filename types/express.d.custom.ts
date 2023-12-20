import { Socket } from 'socket.io';
import { User } from '../src/models/user';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }

    // namespace SocketIO {
    //     interface Socket {
    //         user?: User;
    //     }
    // }
}
