import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload, JwtPayload as JwtLibPayload} from "jsonwebtoken";

interface AppJwtPayload extends JwtLibPayload {
    id: number;
    email: string;
}


export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        // Simula SecurityContext
        (req as any).user = {
            id: decoded.sub,
            email: decoded.email,
        };

        next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
