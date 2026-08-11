import userService from "../services/users.service.js";

class UserController {
    async findAll(req, res, next) {
        try {
            const users = await userService.findAll();
            res.json({ status: 'success', payload: users });
        } catch (error) {
            next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const user = await userService.findById(req.params.uid);
            res.json({ status: 'success', payload: user });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const newUser = await userService.create(req.body);
            res.status(201).json({ status: 'success', payload: newUser });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const updatedUser = await usersService.update(req.params.id, req.body);
            res.json({ status: 'success', payload: updatedUser });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await userService.delete(req.params.uid);
            res.json({ message: "Usuario eliminado" });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();