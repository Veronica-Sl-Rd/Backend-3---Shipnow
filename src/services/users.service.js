import userRepository from "../repositories/users.repository.js";
import { USER_ROLES } from "../constants/index.js";
import AppError from '../utils/errors.js';

class UserService {
    async findAll() {
        return await userRepository.findAll();
    }

    async findById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404);
        }
        return user;
    }

    async create(userData) {
        const { firstName, lastName, email, password, role } = userData;
        if (!firstName || !lastName || !email || !password) {
            throw new AppError('Faltan datos obligatorios', 400);
        }
        if (role === USER_ROLES.ADMIN) {
            throw new AppError('No puedes crear admin', 403);
        }
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new AppError('El email ya está registrado', 409);
        }
        return await userRepository.create({
            firstName,
            lastName,
            email,
            password,
            role: role || USER_ROLES.CUSTOMER,
        });
    }

    async update(id, userData) {
        const updatedUser = await usersRepository.update(id, userData);
        if (!updatedUser) {
            throw new AppError('Usuario no encontrado', 404);
        }
        return updatedUser;
    }

    async delete(id) {
        const user = await userRepository.delete(id);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404);
        }
        return user;
    }
}

export default new UserService();