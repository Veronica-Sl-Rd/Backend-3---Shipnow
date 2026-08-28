import mongoose from "mongoose";
import { before, after } from "mocha";
import config from "../src/config/index.js";

before(async function () {
    this.timeout(10000);

    await mongoose.connect(config.MONGODB_URI);
});

after(async function () {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});