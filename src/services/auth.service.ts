import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {
    async login(email: string, password: string) {
        const user = await UserRepository.findOneBy({ email });
        if (!user) throw new Error("Invalid credentials");

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Invalid credentials");

        const JWT_SECRET = process.env.JWT_SECRET as string;
        const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;

        const token = jwt.sign(
            { sub: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }
}

export const authService = new AuthService();
