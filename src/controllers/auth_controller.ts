import { NextFunction, Request, Response } from "express";

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.json({
    message: 'User is not authenticated',
    isAuth: false
  })
}
