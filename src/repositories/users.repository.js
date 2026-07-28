import User from "../models/user.model.js";

class UserRepository {
    async findAll() {
        return await User.find();
    }

    async findById(id) {
        return await User.findById(id);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findByRole(role) {
        return User.find({ role });
    }

    async findAvailableDriverByCity(city) {
        return User.findOne({ city, available: true, role: 'driver' });
    }

    async create(userData) {
        return await User.create(userData);
    }

    async update(id, userData) {
        return User.findByIdAndUpdate(id, userData, { new: true });
    }

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }
}

export default new UserRepository();