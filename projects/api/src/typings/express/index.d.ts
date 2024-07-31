import { UserDocument } from '../../models/user';
import { SessionData } from 'express-session';

declare global {
    namespace Express {
        interface User extends UserDocument {}
    }
}

declare module 'express-session' {
    interface SessionData {
        passport: {
            user: { [key: string]: any };
        };
    }
}
