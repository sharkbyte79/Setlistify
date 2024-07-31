import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { NextFunction, Request, Response, Router } from 'express';

import User from '../models/user';

export const router: Router = Router();

dotenv.config();

if (!process.env.SETLIST_FM_API_KEY) {
    throw new Error('Setlist.fm API key not found in environment variables');
}

const setlistKey: string = process.env.SETLIST_FM_API_KEY;

router.get('/playlist/create', async (req: Request, res: Response) => {
    /**
     * Get access token
     */
    console.log(req.user);

    const user_id: string = req.user?.spotifyId ?? '';
    const access_token: string = req.user?.access_token ?? '';

    await axios
        .post(
            `https://api.spotify.com/v1/users/${user_id}/playlists`,
            {
                name: 'New Setlistify playlist',
                description: 'Created with Setlistify',
                public: false, // default to private playlist
            },
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
            }
        )
        .then((response) => {
            console.log('[server]: Playlist successfully created');
            res.sendStatus(response.status);
        })
        .catch((err) => {
            throw new Error(
                '[server]: Error occured creating playlist\n' + err
            );
        });
});

function populatePlaylist(
    userId: string,
    accessToken: string,
    playlistUrl: string
) {}

/**
 *
 */
function parseSetlistURL(setlist_url: string): string {
    if (!setlist_url) {
        throw new Error('Setlist ID cannot be parsed without url');
    }

    return setlist_url.split('/').pop()?.split('-').pop()?.split('.')[0] ?? '';
}
