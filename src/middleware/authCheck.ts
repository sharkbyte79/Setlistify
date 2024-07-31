import { Request, Response, NextFunction } from 'express';

export async function ensureAuthenticated(
    res: Response,
    req: Request,
    next: NextFunction
) {
    try {
        if (req.isAuthenticated()) {
            return next();
        }
        // Send user to get authenticated
        res.redirect('/auth');
    } catch (err: any) {
        next(err);
    }
}
