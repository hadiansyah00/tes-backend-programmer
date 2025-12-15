const swaggerJSDoc = require("swagger-jsdoc");

module.exports = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SIMS PPOB API",
      version: "1.0.0",
      description: "Take Home Test API Documentation for SIMS PPOB",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/docs/*.yaml"],
});
