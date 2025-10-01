import { Request, Response, NextFunction } from 'express';

import { config } from '../../config/index.js';
import { ApiResponse } from '../../shared/types/index.js';


export const authMiddleware = (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction,
): void => {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey || apiKey !== config.apiKey) {
        res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: 'Invalid or missing API key',
        });
        return;
    }

    next();
};
