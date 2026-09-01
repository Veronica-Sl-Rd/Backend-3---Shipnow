import userRepository from "../repositories/users.repository.js";
import { USER_ROLES } from "../constants/index.js";
import CustomError from '../utils/errors.js';
import { ERROR_CODES } from "../constants/error.constants.js";
import { DOCUMENT_TYPES } from "../constants/file.constants.js";
import { deleteFile } from "../utils/file.utils.js";
import logger from "../utils/logger.js";

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
    async addDocument(userId, file, documentType) {
        try {
        const user = await userRepository.findById(userId);
        if (!user) {throw new CustomError(ERROR_CODES.USER_NOT_FOUND);}
        if (!file) {throw new CustomError(ERROR_CODES.FILE_REQUIRED);}
        if (!Object.values(DOCUMENT_TYPES).includes(documentType)) {
            throw new CustomError(ERROR_CODES.INVALID_DOCUMENT_TYPE);
        }
        const documentData = {
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            documentType,
            uploadedAt: new Date()
        };
        const updatedUser = await userRepository.addDocument(userId, documentData);
        logger.info(`Documento ${documentType} cargado correctamente para el usuario ${userId}`);
        return updatedUser;
        } catch (error) {
            if (file?.path) {await deleteFile(file.path);}
            throw error;
        }
    }
}

export default new UserService();