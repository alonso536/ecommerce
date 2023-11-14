import swaggerJsdoc from "swagger-jsdoc";
import { dirname } from "../path.js";

const swagger = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación de Aplicación Ecommerce",
            description: "Api para la aplicación Ecommerce: Alonso Díaz"
        }
    },
    apis: [`${dirname}/docs/**/*.yml`]
}

export const specs = swaggerJsdoc(swagger);