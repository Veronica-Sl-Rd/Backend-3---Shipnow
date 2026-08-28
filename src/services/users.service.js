import userRepository from "../repositories/users.repository.js";
import { USER_ROLES } from "../constants/index.js";
import CustomError from '../utils/errors.js';
import { ERROR_CODES } from "../constants/error.constants.js";

class UserService {
    async findAll() {
        return await userRepository.findAll();
    }

    async findById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
        }
        return user;
    }

    async create(userData) {
        const { firstName, lastName, email, password, role, city, available, vehicle, documents } = userData;
        if (!firstName || !lastName || !email || !password) {
            throw new CustomError(ERROR_CODES.VALIDATION_ERROR);
        }
        if (role === USER_ROLES.ADMIN) {
            throw new CustomError(ERROR_CODES.ADMIN_CREATION_FORBIDDEN);
        }
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new CustomError(ERROR_CODES.USER_ALREADY_EXIST);
        }
        return await userRepository.create({
            firstName,
            lastName,
            email,
            password,
            role: role || USER_ROLES.CUSTOMER,
            city,
            available,
            vehicle,
            documents
        });
    }

    async update(id, userData) {
        const updatedUser = await userRepository.update(id, userData);
        if (!updatedUser) {
            throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
        }
        return updatedUser;
    }

    async delete(id) {
        const user = await userRepository.delete(id);
        if (!user) {
            throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
        }
        return user;
    }
}

export default new UserService();