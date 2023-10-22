import { faker } from "@faker-js/faker";

export const generateMockProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.uuid(),
        price: faker.commerce.price(),
        stock: faker.number.int(30),   
    }
}