import { Router } from 'express';

import { router as authRoute } from './auth';
import { router as playlistRoute } from './playlist';

export const routes: Router = Router();

const routers: Router[] = [authRoute, playlistRoute];
routers.forEach((router: Router) => {
    routes.use(router);
});
