import userRepository from "../repositories/users.repository.js";
import { USER_ROLES } from "../constants/index.js";

class UserService {
    async getAll() {
        return await userRepository.getAll();}

    async getById(id) {
        const user = await userRepository.getById(id);
        if (!user) {
            throw {
                status: 404,
                message: "Usuario no encontrado",
            };}
        return user;}

    async create(userData) {
        const { firstName, lastName, email, password, role } = userData;
        if (!firstName || !lastName || !email || !password) {
            throw {
                status: 400,
                message: "Faltan datos obligatorios",
            };}
        if (role === USER_ROLES.ADMIN) {
            throw {
                status: 403,
                message: "No puedes crear admin",
            };}
        const existingUser = await userRepository.getByEmail(email);
        if (existingUser) {
            throw {
                status: 409,
                message: "El email ya esta registrado",
            };}
        return await userRepository.create({
            firstName,
            lastName,
            email,
            password,
            role: role || USER_ROLES.CUSTOMER,
        });}

    async delete(id) {
        const user = await userRepository.delete(id);
        if (!user) {
            throw {
                status: 404,
                message: "Usuario no encontrado",
            };}
        return user;}
}

export default new UserService();