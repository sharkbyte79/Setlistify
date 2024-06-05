import express, { Express, Router } from 'express';
import passport, { AuthenticateOptions } from 'passport';

const router: Router = Router();

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
        showDialog: true, // Always ask for permission to authorize Spotify account access
    } as AuthenticateOptions)
);
