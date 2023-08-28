import mongoose from "mongoose";

export const connect = async () => {
    const urlMongo = "mongodb://localhost:27017/ecommerce";
    try {
        await mongoose.connect(urlMongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Database online");
    } catch (error) {
        console.log(error);
    }
};
