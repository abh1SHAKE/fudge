import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types/api.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = { ...err };
    error.message = err.message;

    console.log(err);

    // Mongoose bad ObjectId
    if (err.name === 'CaseError') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
        error = { message, statusCode: 400 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    } as ApiResponse )
};