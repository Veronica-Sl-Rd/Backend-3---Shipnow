import productRepository from "../repositories/products.repository.js";
import { PRODUCT_STATUS } from "../constants/index.js";

class ProductService {
    async getAll() {
        return await productRepository.getAll();}

    async getById(id) {
        const product = await productRepository.getById(id);
        if (!product) {
            throw {
                status: 404,
                message: "Producto no encontrado",
            };}
        return product;}

    async create(productData) {
        const { name, description, price, stock, category, status } = productData;
        if (!name || price === undefined || stock === undefined) {
            throw {
                status: 400,
                message: "Faltan datos obligatorios (name, price, stock)",
            };}
        if (price < 0) {
            throw {
                status: 400,
                message: "El precio no puede ser negativo",
            };}
        if (stock < 0) {
            throw {
                status: 400,
                message: "El stock no puede ser negativo",
            };}
        return await productRepository.create({
            name,
            description,
            price,
            stock,
            category,
            status:
                stock > 0
                    ? status || PRODUCT_STATUS.AVAILABLE
                    : PRODUCT_STATUS.OUT_OF_STOCK,
        });}

    async update(id, productData) {
    const { name, description, price, stock, category, status } = productData;
    const product = await productRepository.getById(id);
    if (!product) {
        throw {
            status: 404,
            message: "Producto no encontrado",
        };}
    if (price !== undefined && price < 0) {
        throw {
            status: 400,
            message: "El precio no puede ser negativo",
        };}
    if (stock !== undefined && stock < 0) {
        throw {
            status: 400,
            message: "El stock no puede ser negativo",
        };}
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) {
        product.stock = stock;
        product.status =
            stock > 0
                ? (status || PRODUCT_STATUS.AVAILABLE)
                : PRODUCT_STATUS.OUT_OF_STOCK;}
    if (category !== undefined) product.category = category;
    if (status !== undefined && product.stock > 0) product.status = status;
    return await productRepository.save(product);}

    async delete(id) {
        const product = await productRepository.delete(id);
        if (!product) {
            throw {
                status: 404,
                message: "Producto no encontrado",
            };}
        return product;}
}

export default new ProductService();