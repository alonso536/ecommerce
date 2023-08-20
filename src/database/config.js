import mongoose from "mongoose";

export const connect = async () => {
    const urlMongo = "";
    try {
        await mongoose.connect(urlMongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Database online");

    } catch(error) {
        console.log(error);
    }
}