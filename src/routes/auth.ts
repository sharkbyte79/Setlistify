import { NextFunction, Request, Response, Router } from 'express';
import passport, { AuthenticateOptions } from 'passport';

export const router: Router = Router();

router.get(
    '/auth',
    passport.authenticate('spotify', {
        scope: [
            'user-read-private',
            'user-read-email',
            'playlist-modify-public',
            'playlist-modify-private',
            'ugc-image-upload',
        ],
        session: true,
        showDialog: true, // Always ask for permission to authorize Spotify account access
    } as AuthenticateOptions)
);

router.get(
    '/auth/callback',
    passport.authenticate('spotify', {
        session: true,
        failureRedirect: '/login',
        failureMessage: true,
    }),
    (req: Request, res: Response) => {
        console.log(req.user);
        res.redirect('/');
    }
);

router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        } else {
            res.redirect('/');
        }
    });
});
