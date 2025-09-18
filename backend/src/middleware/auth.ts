import type { NextFunction, Request, Response } from "express";
import type { IUser } from "../models/User.js";
import type { ApiResponse } from "../types/api.js";
import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export interface AuthRequest extends Request {
    user?: IUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            } as ApiResponse );
        }

        const decoded = verifyToken(token);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            } as ApiResponse )
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        } as ApiResponse )
    }
};

export const requireAdmin = (req : AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        } as ApiResponse );
    }

    next();
};