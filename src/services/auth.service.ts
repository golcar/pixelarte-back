import {UserRepository} from "../repositories/user.repository";
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

        const secret = process.env.JWT_SECRET as string;

        return jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            secret,
            {
                expiresIn: "8h",
            }
        );
    }
}

export const authService = new AuthService();
