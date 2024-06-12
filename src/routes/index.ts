import { Router } from 'express';
import { router as authRoute } from './auth';

export const routes: Router = Router();

const routers: Array<Router> = [authRoute];
routers.forEach((router: Router) => {
    routes.use(router);
})
