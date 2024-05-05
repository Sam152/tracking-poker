import { NextFunction, Request, Response } from "express";

export function cacheMiddleware(req: Request, res: Response, next: NextFunction) {
    res.header("Cache-Control", "public, max-age=60, s-max-age=600");
    next();
}
