import Delivery from '../models/delivery.model.js';

class DeliveriesRepository {

    async findAll(filter = {}, page, limit) {
        const skip = (page - 1) * limit;
        const [deliveries, total] = await Promise.all([
            Delivery.find(filter)
                .populate('order')
                .populate('driver', 'firstName lastName email')
                .skip(skip)
                .limit(limit),
            Delivery.countDocuments(filter)
        ]);
        return {deliveries, total};
    }

    async findById(id) {
        return Delivery.findById(id)
            .populate('order')
            .populate('driver', 'firstName lastName email');
    }

    async create(deliveryData) {
        return Delivery.create(deliveryData);
    }

    async update(id, deliveryData) {
        return Delivery.findByIdAndUpdate(id, deliveryData, { new: true });
    }

    async delete(id) {
        return Delivery.findByIdAndDelete(id);
    }

    async addProof(id, proofData) {
    return await Delivery.findByIdAndUpdate(id,{proof: proofData},
        {
            new: true,
            runValidators: true
        }
    );
}
}

export default new DeliveriesRepository();