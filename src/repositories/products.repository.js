import Product from "../models/product.model.js";

class ProductRepository {
    async getAll() {
        return await Product.find();}

    async getById(id) {
        return await Product.findById(id);}

    async create(productData) {
        return await Product.create(productData);}

    async save(product) {
    return await product.save();}

    async delete(id) {
        return await Product.findByIdAndDelete(id);}
}

export default new ProductRepository();