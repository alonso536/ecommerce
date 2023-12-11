import { v2 as cloudinary } from "cloudinary";

class UploadManager {
    constructor() {
        cloudinary.config(process.env.CLOUDINARY_URL);
    }

    async upload(collection, model, file) {
        const url = await this.copy(file);

        try {
            switch(collection) {
                case "users":
                    if(model.avatar) {
                        await this.destroy(model.avatar);
                    }

                    model.avatar = url;
                    await model.save();

                    return model;
                case "products":
                    model.thumbnails.push(url);
                    await model.save();

                    return model;
                default:
                    throw new Error("La colección no es válida");
            }
        } catch(error) {
            throw new Error(error.toString());
        }
    }

    async copy(file) {
        try {
            const { tempFilePath } = file;
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
            return secure_url;
        } catch(error) {
            throw new Error("No se pudo subir el archivo");
        }

    }

    async destroy(file) {
        try {
            const filename = file.split("/").at(-1);
            const publicId = filename.split(".").at(0);
            await cloudinary.uploader.destroy(publicId);
        } catch(error) {
            throw new Error("No se pudo eliminar el archivo");
        }
    }
}

export default UploadManager;