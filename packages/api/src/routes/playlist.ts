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
            //res.sendStatus(response.status);
        })
        .catch((err) => {
            throw new Error(
                '[server]: Error occured creating playlist\n' + err
            );
        });
    
    const setlistID: string = parseSetlistURL('https://www.setlist.fm/setlist/slaughter-beach-dog/2024/space-evanston-il-63ab9ef3.html')

    const response = await axios.get(`https://api.setlist.fm/rest/1.0/setlist/63ab9ef3`, {
      headers: {
        'x-api-key': process.env.SETLIST_FM_API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'setlistify/1.0' // Setlist.fm might require a User-Agent header
      }
    });
    res.json(response.data);
    
});

router.get('playlist/populate', async (req: Request, res: Response) => {
    res.send('Test');
})

function populatePlaylist(
    userId: string,
    accessToken: string,
    playlistUrl: string
) {}

/**
 * Takes a string representing the link to a setlist on setlist.fm and parses it for the 'setlist ID'.
 
 * @param setlist_url - the full URL of a concert's setlist on setlist.fm
 * 
 * @remarks
 * Format of a URL: https://www.setlist.fm/setlist/slaughter-beach-dog/2024/space-evanston-il-${SETLISTID}.html
 */
function parseSetlistURL(setlist_url: string): string {
    if (!setlist_url) {
        throw new Error('Setlist ID cannot be parsed without url');
    }

    return setlist_url.split('/').pop()?.split('-').pop()?.split('.')[0] ?? '';
}
