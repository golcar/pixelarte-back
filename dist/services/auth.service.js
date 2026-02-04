"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    async login(email, password) {
        const user = await user_repository_1.UserRepository.findOneBy({ email });
        if (!user)
            throw new Error("Invalid credentials");
        const valid = await bcrypt_1.default.compare(password, user.password);
        if (!valid)
            throw new Error("Invalid credentials");
        const JWT_SECRET = process.env.JWT_SECRET;
        const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
        const secret = process.env.JWT_SECRET;
        return jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
        }, secret, {
            expiresIn: "8h",
        });
    }
}
exports.authService = new AuthService();
