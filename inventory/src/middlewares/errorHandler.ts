import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

export function errorNotFoundHandler(req: Request, res: Response, next: NextFunction): void {
    next(createError(404));
}

declare type WebError = Error & { status?: number };
export function errorHandler(err: WebError, req: Request, res: Response, next: NextFunction): void {
    res.status(err.status || 500);
    res.send({ error: req.app.get("env") === "development" ? err.message : "Something went wrong" });
}
