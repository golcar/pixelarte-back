import { Request, Response, NextFunction } from 'express';

export function roleMiddleware(role: 'ADMIN' | 'USER') {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user || user.role !== role) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    };
}
