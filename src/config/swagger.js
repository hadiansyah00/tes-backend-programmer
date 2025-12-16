const swaggerJSDoc = require("swagger-jsdoc");

module.exports = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SIMS PPOB API",
      version: "1.0.0",
      description: "Take Home Test API Documentation for SIMS PPOB",
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:3000",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/docs/*.yaml"],
});
