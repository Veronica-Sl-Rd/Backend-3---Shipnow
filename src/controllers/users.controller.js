import userService from "../services/users.service.js";

class UserController {
    async getAll(req, res) {
        try {
            const users = await userService.getAll();
            res.json(users);
        } catch (error) {
            if (error.status) {return res.status(error.status).json({
                    error: error.message,});}
            res.status(500).send("Error del servidor");}
    }

    async getById(req, res) {
        try {
            const user = await userService.getById(req.params.uid);
            res.json(user);
        } catch (error) {
            if (error.status) {return res.status(error.status).json({
                    error: error.message,});}
            res.status(500).send("Error del servidor");}
    }

    async create(req, res) {
        try {
            const newUser = await userService.create(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            if (error.status) {return res.status(error.status).json({
                    error: error.message,});}
            res.status(500).send("Error del servidor");}
    }

    async delete(req, res) {
        try {
            await userService.delete(req.params.uid);
            res.json({ message: "Usuario eliminado" });
        } catch (error) {
            if (error.status) {return res.status(error.status).json({
                    error: error.message,});}
            res.status(500).send("Error del servidor");}
    }
}

export default new UserController();