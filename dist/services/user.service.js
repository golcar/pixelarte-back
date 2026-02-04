"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    async create(userData) {
        const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
        const user = user_repository_1.UserRepository.create({
            ...userData,
            password: hashedPassword,
        });
        return await user_repository_1.UserRepository.save(user);
    }
    async findAll() {
        return await user_repository_1.UserRepository.find();
    }
    async findById(id) {
        return await user_repository_1.UserRepository.findOneBy({ id });
    }
    async delete(id) {
        await user_repository_1.UserRepository.delete(id);
    }
}
exports.userService = new UserService();
