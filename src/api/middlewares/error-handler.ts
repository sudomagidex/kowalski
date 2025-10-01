import { Request, Response, NextFunction } from 'express';

import { ApiResponse } from '../../shared/types/index.js';
import { logger } from '../../shared/utils/logger.js';

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response<ApiResponse>,
    _next: NextFunction,
): void => {
    logger.error({ err }, 'Request error');

    res.status(500).json({
        success: false,
        error: err.message,
        message: 'Internal server error',
    });
};
