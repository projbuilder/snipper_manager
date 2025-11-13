import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import AuditLog from '../models/AuditLog';
import logger from '../utils/logger';

export const auditLog = (action: string, targetType: string) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        next();
        return;
      }

      const targetId = req.params.id || req.body._id || req.body.id;
      const ip = req.ip || req.connection.remoteAddress || 'unknown';

      await AuditLog.create({
        userId: req.user.id,
        action,
        targetType,
        targetId,
        ip,
        metadata: {
          method: req.method,
          path: req.path,
          userAgent: req.get('user-agent'),
        },
      });

      next();
    } catch (error) {
      logger.error('Audit log failed:', error);
      // Don't block the request if audit fails
      next();
    }
  };
};
