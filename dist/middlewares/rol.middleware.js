"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = roleMiddleware;
function roleMiddleware(role) {
    return (req, res, next) => {
        const user = req.user;
        if (!user || user.role !== role) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}
