import { UserRepository } from "../repositories/user.repository";
import { User } from "../entities/User";
import bcrypt from "bcrypt";


class UserService {
    async create(userData: Partial<User>): Promise<User> {
        const hashedPassword = await bcrypt.hash(userData.password!, 10);
        const user = UserRepository.create({
            ...userData,
            password: hashedPassword,
        });
        return await UserRepository.save(user);
    }
    async findAll(): Promise<User[]> {
        return await UserRepository.find();
    }

    async findById(id: number): Promise<User | null> {
        return await UserRepository.findOneBy({ id });
    }

    async delete(id: number): Promise<void> {
        await UserRepository.delete(id);
    }
}

export const userService = new UserService();
